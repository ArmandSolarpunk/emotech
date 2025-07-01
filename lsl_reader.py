# lsl_reader.py
"""
Fichier: lsl_reader.py

description: Ce fichier permet de lire le flux LSL provenant de l'EmotiBit Oscilloscope.
Il est important de sélectionner l'output LSL sur le EmotiBit Oscilloscope pour que le flux puisse être lu.

navigation: Une fois lancé par app.js, ce script va être arrêté de la même façon automatiquement.
"""

from fonctions import start_recording

if __name__ == "__main__":
    # Choisis ici le nom du fichier
    start_recording(csv_file='raw.csv')
