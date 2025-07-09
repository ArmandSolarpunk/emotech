import pandas as pd
import numpy as np

data = pd.read_csv('C:/Users/arman/Desktop/Premierprojet/data/machineLearning.csv')

EMOTION_MAP = {
    1: -1,
    2: 1,
    3: -1,
    4: -1,
    5: -1,
    6: 1
}

data['emotion_mapped'] = data['emotion'].map(EMOTION_MAP)

data.to_csv("3ML.csv", index=False)