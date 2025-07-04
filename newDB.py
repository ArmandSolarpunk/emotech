import pandas as pd

# Dictionnaire de codage des émotions
emotion_encoding = {
    'Joie': [1, 1],
    'Peur': [-1, 1],
    'Tristesse': [-1, -1],
    'Calme': [1, -1]
}

# Charger les données
features_df = pd.read_csv('features_detection.csv')
emotion_list = pd.read_csv('data_platform.csv')['emotionsResentis']

# Vérifier si les colonnes existent déjà, sinon les créer
if 'valence' not in features_df.columns:
    features_df['valence'] = None
if 'arousal' not in features_df.columns:
    features_df['arousal'] = None

# Trouver les lignes sans valence (donc pas encore traitées)
missing_mask = features_df['valence'].isnull()
missing_indices = features_df[missing_mask].index

# Prendre les émotions correspondantes aux lignes manquantes
# Attention : il faut que le nombre de lignes corresponde
if len(missing_indices) != len(emotion_list):
    raise ValueError(f"Mismatch: {len(missing_indices)} lignes sans étiquettes, mais {len(emotion_list)} émotions disponibles.")

# Appliquer l'encodage
for idx, emo in zip(missing_indices, emotion_list):
    val, aro = emotion_encoding.get(emo, [None, None])
    features_df.at[idx, 'valence'] = val
    features_df.at[idx, 'arousal'] = aro

# Sauvegarde
features_df.to_csv('features_detection.csv', index=False)