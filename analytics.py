import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

EMOTION_MAP = {
    1: 'Dégout',
    2: 'Joie',
    3: 'Peur',
    4: 'Tristesse',
    5: 'Colère',
    6: 'Surprise'
}

def visualisation(df, signal):
    df['emotion_label'] = df['emotion'].map(EMOTION_MAP)
    sns.lineplot(x=df['emotion_label'], y=df[signal])
    plt.xlabel('Emotion')
    plt.ylabel(signal)
    plt.title('repartition signal')
    plt.grid()
    plt.show()

def comparaison(df, signal, signal2,signal3=None):
    sns.lineplot(x=df['emotion_label'], y=df[signal2], label=signal2)
    sns.lineplot(x=df['emotion_label'], y=df[signal], label=signal)
    #sns.lineplot(x=df['Time'], y=df[signal3], label=signal3)
    plt.xlabel('Emotion')
    plt.title('repartition signal')
    plt.grid()
    plt.show()

data= pd.read_csv('C:/Users/arman/Desktop/Premierprojet/data/machineLearning.csv', on_bad_lines='skip')

visualisation(data,'PPG_GRN_mean')