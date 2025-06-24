import os
import pandas as pd
import glob

# Cherche tous les CSV dans le dossier racine et tous les sous-dossiers
csv_files = glob.glob('chemin/vers/racine/**/relative_features.csv', recursive=True)

if not csv_files:
    print("Aucun fichier 'relative_features.csv' trouvé.")
    exit()

csv_list = []

for file in csv_files:
    try:
        print(f'Lecture du fichier : {file}')
        df = pd.read_csv(file, error_bad_lines=False)  # Ignore les lignes cassées
        csv_list.append(df)
    except Exception as e:
        print(f"Erreur lors de la lecture du fichier {file} : {e}")

# Fusionner tous les fichiers en un seul CSV
if csv_list:
    merged_df = pd.concat(csv_list, ignore_index=True)
    merged_df.to_csv('machineLearning.csv', index=False)
    print('Tous les CSV ont été fusionnés avec succès.')
else:
    print("Aucun fichier valide n'a pu être lu.")