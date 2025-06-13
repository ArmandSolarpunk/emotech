import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

data = pd.read_csv("raw.csv")
features = pd.DataFrame()
timestamps = [10000, 20000, 30000]
emotions = ['Dégout','Joie','Peur']


def feature_extraction(df, timestamps, emotions):
    for i in range (len(timestamps)):
        extrait = df
        emotion = emotions[i]
    #pipe line d'extraction 

        match emotion:
            case 'Baseline':
                features['emotion']=0
            case 'Joie':
                features['emotion']=1
            case 'Peur':
                features['emotion']=2
            case 'Tristesse':
                features['emotion']=3
            case 'Colère':
                features['emotion']=4
            case 'Dégout':
                features['emotion']=5
            case 'surprise':
                features['emotion']=6             