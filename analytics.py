import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

features = ['EDA_mean','EDA_std','PPG_GRN_mean','PPG_GRN_std','PPG_IR_mean','PPG_IR_std','PPG_RED_mean',
          'PPG_RED_std','TEMP1_mean','TEMP1_std','PPG_IR_HR_brut_mean','PPG_IR_HR_brut_std','PPG_GRN_HR_brut_mean',
          'PPG_GRN_HR_brut_std','PPG_RED_HR_brut_mean','PPG_RED_HR_brut_std','PPG_IR_IBI_brut_mean',
          'PPG_IR_IBI_brut_std','PPG_GRN_IBI_brut_mean','PPG_GRN_IBI_brut_std','PPG_RED_IBI_brut_mean',
          'PPG_RED_IBI_brut_std',
          ]

data = pd.read_csv("C:/Users/arman/Desktop/Premierprojet/data/finalML.csv")



for i in features:
    data = data.dropna(subset=['tableau', i, 'personne_id'])

    sns.scatterplot(data=data, x='tableau', y=i, hue='personne_id', palette='tab10')
    plt.xlabel('tableau')
    plt.ylabel(i)
    plt.title("Répartition des features")
    plt.xlim(-1, 20)
    plt.xticks(np.arange(-1, 21, 1))
    plt.grid()
    plt.show()
"""
df = pd.read_csv("C:/Users/arman/Desktop/Premierprojet/data/big_data.csv")
data['emotionsResentis']=df['emotionsResentis']

data['personne_id'] = df['personne_id']
data['tableau'] = df['tableau']
data['Val'] = df['valence']
data['Ar'] = df['arousal']

data.to_csv('C:/Users/arman/Desktop/Premierprojet/data/finalML.csv',index=False)  



emotion_counts = df.groupby(['tableau','emotionsResentis']).size().unstack(fill_value=0)

emotion_counts.plot(
    kind='bar',
    stacked=True,
    figsize=(12, 6),
    color=['#A1D99B', '#FC9272', '#9ECAE1', '#BCBDDC']  # couleurs personnalisées
)

plt.xlabel('Tableau')
plt.ylabel("émotions")
plt.title("Répartition des émotions par tableau")
plt.legend(title='Émotion')
plt.grid(axis='y')
plt.tight_layout()
plt.show()

df['personne_id'] = df.index // 20
df['tableau'] = df.index % 20
df.to_csv('C:/Users/arman/Desktop/Premierprojet/data/big_data.csv',index=False)    

plt.figure(figsize=(8, 6))
sns.kdeplot(
    data=df,
    x='valence',
    y='arousal',
    cmap="rocket",  # jolie palette, tu peux essayer "viridis", "rocket", etc.
    fill=True,
    thresh=0.05,  # seuil de visibilité
    levels=100,)


plt.xlabel('valence')
plt.ylabel("arousal")
plt.title("Répartition des émotions")
plt.grid(True)
plt.show()"""
