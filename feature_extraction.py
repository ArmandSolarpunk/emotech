import pandas as pd
import numpy as np
from scipy.signal import find_peaks, welch
import os

# Dictionnaire d'encodage (valence, arousal)
emotion_encoding = {
    'baseline': [0, 0],
    'Joie': [1, 1],
    'Peur': [-1, 1],
    'Tristesse': [-1, -1],
    'Calme': [1, -1]
}

def rmssd(donnee):
    return np.sqrt(np.mean(np.diff(donnee) ** 2))

# Pipeline de calcul des features sur une fenêtre donnée
def pipeline(df):
    features = {}

    for x in df.columns:
        donnee = df[x].dropna()
        if x == 'EDA':
            features['EDA_mean'] = donnee.mean()
            features['EDA_std'] = donnee.std()

        elif x == 'PPG_GRN':
            features['PPG_GRN_mean'] = donnee.mean()
            features['PPG_GRN_std'] = donnee.std()

        elif x == 'PPG_IR':
            features['PPG_IR_mean'] = donnee.mean()
            features['PPG_IR_std'] = donnee.std()

        elif x == 'PPG_RED':
            features['PPG_RED_mean'] = donnee.mean()
            features['PPG_RED_std'] = donnee.std()

        elif x == 'TEMP1':
            features['TEMP1_mean'] = donnee.mean()
            features['TEMP1_std'] = donnee.std()

        elif x.endswith('HR_brut'):
            features[f'{x}_mean'] = donnee.mean()
            features[f'{x}_std'] = donnee.std()
            features[f'{x}_rmssd'] = rmssd(donnee)

        elif x.endswith('IBI_brut'):
            features[f'{x}_mean'] = donnee.mean()
            features[f'{x}_std'] = donnee.std()
            features[f'{x}_rmssd'] = rmssd(donnee)
        else:
            continue
    return features

# Fonction principale d'extraction
def feature_extraction(df, timestamps, emotions):
    all_features = []

    # Baseline (avant le premier timestamp)
    baseline_df = df[df['Time'] < timestamps[0]]
    features = pipeline(baseline_df)
    features['valence'], features['arousal'] = emotion_encoding['baseline']
    all_features.append(features)

    # Fenêtres émotionnelles
    for i in range(len(timestamps)):
        start = timestamps[i]
        end = start + 5000  # fenêtre de 5 secondes
        extrait = df[(df['Time'] >= start) & (df['Time'] <= end)]
        features = pipeline(extrait)
        valence, arousal = emotion_encoding[emotions[i]]
        features['valence'] = valence
        features['arousal'] = arousal
        all_features.append(features)

    return pd.DataFrame(all_features)

def variation_relative(df):
    # Récupérer la baseline (assumée être la première ligne avec valence=0 et arousal=0)
    baseline = df[(df['valence'] == 0) & (df['arousal'] == 0)].iloc[0]

    variations = []

    for i in range(len(df)):
        row = df.iloc[i]

        # Ne pas calculer la variation pour la baseline
        if (row['valence'] == 0) and (row['arousal'] == 0):
            continue

        # On retire les colonnes valence et arousal du calcul
        signal_features = row.drop(['valence', 'arousal'])
        baseline_features = baseline.drop(['valence', 'arousal'])

        variation = (signal_features - baseline_features) / (baseline_features + 1e-6)  # éviter division par 0
        variation['valence'] = row['valence']
        variation['arousal'] = row['arousal']
        variations.append(variation)

    return pd.DataFrame(variations)


if __name__ == '__main__':
    # Chargement des données
    data = pd.read_csv("C:/Users/arman/Desktop/Premierprojet/backend/cleaned_data.csv")
    plateforme = pd.read_csv("C:/Users/arman/Desktop/Premierprojet/backend/data_platform.csv")

    # Traitement des timestamps et émotions
    timestamps = pd.to_numeric(plateforme['timestamp'], errors='coerce').dropna()
    emotions = plateforme['emotionsResentis'].dropna()
    emotions = emotions[emotions.str.lower() != 'undefined']

    # Extraction des features
    features_df = feature_extraction(data, timestamps, emotions)
    variations_df = variation_relative(features_df)

    # Sauvegarde
    features_df.to_csv('features_extracted.csv', index=False)
    variations_df.to_csv('relative_features.csv', index=False)

    print("fin du feature extraction")