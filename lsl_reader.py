"""
Fichier: lsl_reader.py

description: ce fichier permet de lire le flux lsl provenant du EmotiBit Oscilloscope
Il est immportant de sélectionner l'output LSL sur le EmotiBit Oscilloscope pour que le flux puisse être lu

navigation: une fois lancé par app.js ce script va être arrêté de la même façon automatiquement
"""
from pylsl import StreamInlet, resolve_streams
import threading
import csv
import os

csv_file = 'raw.csv'


# Effacer le fichier à chaque lancement (le recréer proprement avec l'entête)
with open(csv_file, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Type', 'Time', 'Data'])  # Écriture de l'entête

def listen_to_stream(info):
    inlet = StreamInlet(info)
    print(f" Connecté au flux {info.name()} ({info.type()}).")

    # Ouvre le fichier une seule fois par thread
    with open(csv_file, mode='a', newline='') as file:
        writer = csv.writer(file)

        # Récupération et print du sample du tipe de valeur et du temps depuis l'allumage du dispositif
        while True:
            sample, timestamp = inlet.pull_sample()
            writer.writerow([info.name(), timestamp, sample[0]])
            file.flush()  # Force l'écriture immédiate dans le fichier

            print(f"{info.name()}, {timestamp}, {sample[0]}")

if __name__ == "__main__":
    print(" Recherche de flux LSL...")
    streams = resolve_streams()

    # Adapter le filtre avec les noms exacts des cannaux voulu, plus d'informations sur le get started de EmotiBit 
    target_names = ['PPG_RED','PPG_IR','PPG_GRN', 'EDA', 'TEMP1']

    found = False

    for info in streams:
        print(f" Flux détecté : {info.name()} ({info.type()})")
        if info.name() in target_names:
            found = True
            threading.Thread(target=listen_to_stream, args=(info,), daemon=True).start()

    if not found:
        print(" Aucun flux attendu trouvé.")

    # Garde le programme en vie
    while True:
        pass