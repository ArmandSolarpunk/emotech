import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.signal import butter, filtfilt, find_peaks
import subprocess


# Lecture des données
data = pd.read_csv("C:/Users/arman/Desktop/Premierprojet/backend/raw.csv", on_bad_lines='skip')
def remov_error(df):
    target_names = ['PPG_RED','PPG_IR','PPG_GRN', 'EDA', 'TEMP1']
    mask = df['Type'].isin(target_names)
    df = df[mask]
    return df

# Fonction pour réinitialiser le temps
def reset_time(df):
    debut = df['Time'].iloc[0]
    df['Time'] = df['Time'] - debut
    df['Time'] = round(df['Time'] * 1000, 0)
    df = df.pivot_table(index='Time', columns='Type', values='Data')
    df = df.reset_index()  # On garde la colonne Time comme colonne et pas comme index
    return df

# Fonction pour supprimer le bruit
def sup_bruit(df, signal,lisse, window, limitation):

    
    window_size = window
    threshold =  limitation# nombre d'écarts-types tolérés

    rolling_mean = df[signal].rolling(window=window_size, center=True, min_periods=1).mean()
    rolling_std = df[signal].rolling(window=window_size, center=True, min_periods=1).std()

    outliers = np.abs(df[signal] - rolling_mean) > threshold * rolling_std
    df[f'{signal}_brut']= df[signal]
    df.loc[outliers, signal] = np.nan

    if lisse == True:
        df[signal]=  df[signal].ewm(span=30, adjust=False).mean()
    df[signal] = df[signal].interpolate()
    return df
#fonction de detection des pics sur le signakl qui corréspondent aux battements cardiaques 
def detect_peaks_ppg(df,signal):
    df[signal] = df[signal].interpolate()
    peaks,_ =find_peaks(df[signal], distance=10) #distance minimale entre chaque intervalle 
    #plt.plot(df['Time'].iloc[peaks], df[signal].iloc[peaks], "x")
    return peaks

def clean_rr_intervals(rr_intervals, max_variation=0.2):
    """
    Nettoie les artefacts en limitant la variation entre deux intervalles RR successifs.
    Si la variation dépasse max_variation (ex: 20%), la valeur est remplacée par la moyenne locale.
    """
    clean_rr = rr_intervals.copy()

    for i in range(1, len(rr_intervals)):
        if np.abs(clean_rr[i] - clean_rr[i - 1]) > max_variation * clean_rr[i - 1]:
            # Si la variation est trop brusque, on remplace par la moyenne glissante locale
            if i >= 2:
                clean_rr[i] = np.mean([clean_rr[i - 2], clean_rr[i - 1]])
            else:
                clean_rr[i] = clean_rr[i - 1]  # Si on est au tout début

    return clean_rr


def heart_rate(df, signal):
    peaks = detect_peaks_ppg(df,signal)

    time_peaks = df['Time'].iloc[peaks].values
    rr_intervals = np.diff(time_peaks) / 1000  # si ton temps est en millisecondes
    rr_intervals[(rr_intervals<0.33)]=0.33
    rr_intervals[(rr_intervals>1.2)]=1.20

    rr_intervals = clean_rr_intervals(rr_intervals)

    # Calcul des fréquences cardiaques instantanées
    hr = 60 / rr_intervals  # bpm
    
    df[f'{signal}_HR'] = np.nan
    df[f'{signal}_IBI'] = np.nan

    # On affecte la IBI aux positions des pics, sauf le premier (car pas d'intervalle)
    for i in range(1, len(peaks)):
        df.at[peaks[i], f'{signal}_IBI'] = rr_intervals[i - 1]
    # On affecte la HR aux positions des pics, sauf le premier (car pas d'intervalle)
    for i in range(1, len(peaks)):
        df.at[peaks[i], f'{signal}_HR'] = hr[i - 1]
    
    # Optionnel : interpolation pour un affichage plus continu
    return df

#fonctions de visualisation pour verifier les signaux 

def visualisation(df, signal):
    sns.lineplot(x=df['Time'], y=df[signal])
    plt.xlabel('Time (ms)')
    plt.ylabel(signal)
    plt.title('cleaned signal')
    plt.grid()
    plt.show()

def comparaison(df, signal, signal2,signal3=None):
    sns.lineplot(x=df['Time'], y=df[signal2], label=signal2)
    sns.lineplot(x=df['Time'], y=df[signal], label=signal)
    #sns.lineplot(x=df['Time'], y=df[signal3], label=signal3)
    plt.xlabel('Time (ms)')
    plt.title('cleaned signal')
    plt.grid()
    plt.show()

# Pipeline de traitement
data = remov_error(data)
data = reset_time(data)

data = heart_rate(data,'PPG_RED')
data = heart_rate(data,'PPG_IR')
data = heart_rate(data,'PPG_GRN')
data = sup_bruit(data, 'PPG_RED', True, 10, 2)
data = sup_bruit(data, 'PPG_GRN', True, 10, 2)
data = sup_bruit(data, 'PPG_IR', True, 10, 2)
data = sup_bruit(data, 'EDA', False, 10, 2)
data = sup_bruit(data, 'TEMP1', True, 10, 2)
data = sup_bruit(data, 'PPG_IR_HR', True, 10, 2)
data = sup_bruit(data, 'PPG_GRN_HR',True, 10, 2)
data = sup_bruit(data, 'PPG_RED_HR', True, 10, 2)
data = sup_bruit(data, 'PPG_IR_IBI', True, 10, 2)
data = sup_bruit(data, 'PPG_GRN_IBI',True, 10, 2)
data = sup_bruit(data, 'PPG_RED_IBI', True, 10, 2)
# data = sup_bruit(data, 'HR', False, 200, 1)

#comparaison(data,'','')
#visualisation(data,'PPG_GRN_HR_brut')

data.to_csv('cleaned_data.csv', index=False)

print("process terminé")
subprocess.run(['python', 'C:/Users/arman/Desktop/Premierprojet/backend/feature_extraction.py'])


"""
EDA : epidermal activity traité 

PPG_GRN : niveau du PPG vert

PPG_IR : niveau du PPG infrarouge

PPG_RED : niveau du PPG rouge

TEMP1: niveau de température traité 

PPG_RED_HR : Heartrate vert lissé

PPG_RED_IBI : interval inter battement rouge lissé

PPG_IR_HR : Heartrate vert lissé

PPG_IR_IBI : interval inter battement rouge lissé

PPG_GRN_HR : Heartrate vert lissé

PPG_GRN_IBI : interval inter battement rouge lissé

PPG_RED_brut,

PPG_GRN_brut,

PPG_IR_brut,

EDA_brut: epidermal activity traité 

TEMP1_brut: niveau de température bruité

PPG_IR_HR_brut : Heartrate infrarouge non lissé

PPG_GRN_HR_brut : Heartrate vert non lissé

PPG_RED_HR_brut: Heartrate rouge non lissé

PPG_IR_IBI_brut: interval inter battement infrarouge non lissé

PPG_GRN_IBI_brut : interval inter battement vert non lissé

PPG_RED_IBI_brut : interval inter battement rouge non lissé

"""