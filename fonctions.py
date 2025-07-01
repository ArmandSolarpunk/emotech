# functions.py

import csv
import sys
import threading
from pylsl import StreamInlet, resolve_streams
import pandas as pd
import numpy as np
from scipy.signal import find_peaks
import seaborn as sns
import matplotlib.pyplot as plt
import subprocess

# ============================
#  fonction lsl reader 
# ============================

def init_csv_file(csv_file):
    """
    Initialise un fichier CSV avec les colonnes ['Type', 'Time', 'Data']
    """
    with open(csv_file, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Type', 'Time', 'Data'])


def listen_to_stream(info, csv_file):
    """
    Écoute un flux LSL donné et écrit les données dans un fichier CSV.
    """
    inlet = StreamInlet(info)
    print(f"Connecté au flux {info.name()} ({info.type()}).")

    with open(csv_file, mode='a', newline='') as file:
        writer = csv.writer(file)

        while True:
            sample, timestamp = inlet.pull_sample()
            writer.writerow([info.name(), timestamp, sample[0]])
            file.flush()
            print(f"{info.name()}, {timestamp}, {sample[0]}")


def start_recording(csv_file='raw.csv', target_names=None):
    """
    Démarre l'enregistrement des flux LSL spécifiés dans target_names
    et écrit dans le fichier CSV donné.
    """
    if target_names is None:
        target_names = ['PPG_RED', 'PPG_IR', 'PPG_GRN', 'EDA', 'TEMP1']

    print(f"Initialisation du fichier {csv_file}...")
    init_csv_file(csv_file)

    print("Recherche de flux LSL...")
    streams = resolve_streams()
    found = False

    for info in streams:
        print(f"Flux détecté : {info.name()} ({info.type()})")
        if info.name() in target_names:
            found = True
            threading.Thread(
                target=listen_to_stream,
                args=(info, csv_file),
                daemon=True
            ).start()

    if not found:
        print("Aucun flux attendu trouvé.")

    while True:
        pass  # Boucle infinie pour maintenir le script actif

# ============================
#  fonction data process 
# ============================

def remov_error(df):
    target_names = ['PPG_RED','PPG_IR','PPG_GRN', 'EDA', 'TEMP1']
    return df[df['Type'].isin(target_names)]

def reset_time(df):
    debut = df['Time'].iloc[0]
    df['Time'] = (df['Time'] - debut) * 1000
    df = df.pivot_table(index='Time', columns='Type', values='Data').reset_index()
    return df

def sup_bruit(df, signal, lisse, window, limitation):
    rolling_mean = df[signal].rolling(window=window, center=True, min_periods=1).mean()
    rolling_std = df[signal].rolling(window=window, center=True, min_periods=1).std()
    outliers = np.abs(df[signal] - rolling_mean) > limitation * rolling_std
    df[f'{signal}_brut'] = df[signal]
    df.loc[outliers, signal] = np.nan
    if lisse:
        df[signal] = df[signal].ewm(span=30, adjust=False).mean()
    df[signal] = df[signal].interpolate()
    return df

def detect_peaks_ppg(df, signal):
    df[signal] = df[signal].interpolate()
    peaks, _ = find_peaks(df[signal], distance=10)
    return peaks

def clean_rr_intervals(rr_intervals, max_variation=0.2):
    clean_rr = rr_intervals.copy()
    for i in range(1, len(rr_intervals)):
        if np.abs(clean_rr[i] - clean_rr[i - 1]) > max_variation * clean_rr[i - 1]:
            clean_rr[i] = np.mean([clean_rr[i - 2], clean_rr[i - 1]]) if i >= 2 else clean_rr[i - 1]
    return clean_rr

def heart_rate(df, signal):
    peaks = detect_peaks_ppg(df, signal)
    time_peaks = df['Time'].iloc[peaks].values
    rr_intervals = np.diff(time_peaks) / 1000
    rr_intervals = np.clip(rr_intervals, 0.33, 1.2)
    rr_intervals = clean_rr_intervals(rr_intervals)
    hr = 60 / rr_intervals

    df[f'{signal}_HR'] = np.nan
    df[f'{signal}_IBI'] = np.nan
    for i in range(1, len(peaks)):
        df.at[peaks[i], f'{signal}_IBI'] = rr_intervals[i - 1]
        df.at[peaks[i], f'{signal}_HR'] = hr[i - 1]
    return df

def visualisation(df, signal):
    sns.lineplot(x=df['Time'], y=df[signal])
    plt.xlabel('Time (ms)')
    plt.ylabel(signal)
    plt.title('cleaned signal')
    plt.grid()
    plt.show()

def comparaison(df, signal1, signal2):
    sns.lineplot(x=df['Time'], y=df[signal1], label=signal1)
    sns.lineplot(x=df['Time'], y=df[signal2], label=signal2)
    plt.xlabel('Time (ms)')
    plt.title('Comparaison des signaux')
    plt.grid()
    plt.legend()
    plt.show()

def run_pipeline(input_path, output_path):
    df = pd.read_csv(input_path, on_bad_lines='skip')
    df = remov_error(df)
    df = reset_time(df)

    for signal in ['PPG_RED', 'PPG_IR', 'PPG_GRN']:
        df = heart_rate(df, signal)

    for signal in ['PPG_RED', 'PPG_IR', 'PPG_GRN', 'EDA', 'TEMP1']:
        df = sup_bruit(df, signal, signal != 'EDA', 10, 2)

    for signal in ['PPG_RED_HR', 'PPG_GRN_HR', 'PPG_IR_HR', 'PPG_RED_IBI', 'PPG_GRN_IBI', 'PPG_IR_IBI']:
        df = sup_bruit(df, signal, True, 10, 2)

    df.to_csv(output_path, index=False)
    print("Traitement terminé.")


# ===============================
#  fonction features extraction
# ===============================

emotion_encoding = {
    'baseline': [0, 0],
    'Joie': [1, 1],
    'Peur': [-1, 1],
    'Tristesse': [-1, -1],
    'Calme': [1, -1]
}

def rmssd(donnee):
    return np.sqrt(np.mean(np.diff(donnee) ** 2))

def pipeline(df):
    """Extrait des features statistiques sur un sous-ensemble de données."""
    features = {}

    for x in df.columns:
        donnee = df[x].dropna()
        if donnee.empty:
            continue

        if x == 'EDA':
            features['EDA_mean'] = donnee.mean()
            features['EDA_std'] = donnee.std()

        elif x.startswith('PPG') or x.startswith('TEMP'):
            features[f'{x}_mean'] = donnee.mean()
            features[f'{x}_std'] = donnee.std()

        elif x.endswith('HR_brut') or x.endswith('IBI_brut'):
            features[f'{x}_mean'] = donnee.mean()
            features[f'{x}_std'] = donnee.std()
            features[f'{x}_rmssd'] = rmssd(donnee)

    return features

def extract_features(df, mode, timestamps=None, emotions=None):
    """
    Extrait les features selon le mode :
    
    - 'collecte_dataset' : utilise timestamps et émotions pour générer un dataset labellisé
    - 'baseline_pure' : calcule les features de tout le fichier sans labels (1 ligne)
    - 'sample_test' : idem, pour comparer avec baseline
    """
    if mode not in ['collecte_dataset', 'baseline_pure', 'sample_test']:
        raise ValueError("Mode must be 'collecte_dataset', 'baseline_pure' or 'sample_test'.")

    all_features = []

    if mode == 'collecte_dataset':
        if timestamps is None or emotions is None:
            raise ValueError("Timestamps et émotions nécessaires en mode 'collecte_dataset'.")

        # Baseline : avant premier timestamp
        baseline_df = df[df['Time'] < timestamps[0]]
        features = pipeline(baseline_df)
        features['valence'], features['arousal'] = emotion_encoding['baseline']
        all_features.append(features)

        # Emotions : 5 sec après chaque timestamp
        for i in range(len(timestamps)):
            start = timestamps[i]
            end = start + 5000
            extrait = df[(df['Time'] >= start) & (df['Time'] <= end)]
            features = pipeline(extrait)
            valence, arousal = emotion_encoding.get(emotions[i], [None, None])
            features['valence'] = valence
            features['arousal'] = arousal
            all_features.append(features)

        return pd.DataFrame(all_features)

    else:
        # Cas 'baseline_pure' ou 'sample_test'
        features = pipeline(df)
        return pd.DataFrame([features])

def compute_variation_relative(df):
    """
    Calcule la variation relative par rapport à la baseline (valence=0/arousal=0).
    """
    baseline = df[(df['valence'] == 0) & (df['arousal'] == 0)].iloc[0]
    variations = []

    for i, row in df.iterrows():
        if (row['valence'] == 0) and (row['arousal'] == 0):
            continue

        signal_features = row.drop(['valence', 'arousal'])
        baseline_features = baseline.drop(['valence', 'arousal'])

        variation = (signal_features - baseline_features) / (baseline_features + 1e-6)
        variation['valence'] = row['valence']
        variation['arousal'] = row['arousal']
        variations.append(variation)

    return pd.DataFrame(variations)