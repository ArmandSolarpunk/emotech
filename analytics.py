import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns


df = pd.read_csv("C:/Users/arman/Desktop/Premierprojet/data/big_data.csv")
df['personne_id'] = df.index // 20

plt.figure(figsize=(8, 6))
sns.kdeplot(
    data=df,
    x='valence ',
    y='arousal',
    cmap="rocket",  # jolie palette, tu peux essayer "viridis", "rocket", etc.
    fill=True,
    thresh=0.05,  # seuil de visibilité
    levels=100,)


plt.xlabel('valence')
plt.ylabel("arousal")
plt.title("Répartition des émotions")
plt.grid(True)
plt.show()