import pandas as pd
import numpy as np
from scipy.signal import find_peaks
import os

# Dictionnaire d'encodage
emotion_encoding = {
    'baseline': 0,
    'Dégout': 1,
    'Joie': 2,
    'Peur': 3,
    'Tristesse': 4,
    'Colère': 5,
    'Surprise': 6
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
    features['emotion'] = emotion_encoding['baseline']  # encodage numérique
    all_features.append(features)

    # Fenêtres émotionnelles
    for i in range(len(timestamps)):
        start = timestamps[i]
        end = start + 5000  # fenêtre de 5 secondes
        extrait = df[(df['Time'] >= start) & (df['Time'] <= end)]
        features = pipeline(extrait)
        features['emotion'] = emotion_encoding[emotions[i]]  # encodage numérique
        all_features.append(features)

    return pd.DataFrame(all_features)

if __name__ == '__main__':
    # Exemple d'initialisation
    data = pd.read_csv("C:/Users/arman/Desktop/Premierprojet/backend/cleaned_data.csv")
    plateforme = pd.read_csv("C:/Users/arman\Desktop/Premierprojet/backend/data_platform.csv")
    timestamps = pd.to_numeric(plateforme['timestamp'], errors='coerce').dropna()
    emotions = plateforme['emotionsResentis'].dropna()
    emotions = emotions[emotions.str.lower() != 'undefined']

    # Exemple d'utilisation
    features_df = feature_extraction(data, timestamps, emotions)

    # Export
    features_df.to_csv('features_extracted.csv', index=False)

    print("fin du feature extraction")