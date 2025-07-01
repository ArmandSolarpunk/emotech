from fonctions import run_pipeline,extract_features
import pandas as pd
import numpy as np
import joblib

emotion_encoding = {
    (1, 1): 'Joie',
    (-1, 1): 'Peur',
    (-1, -1): 'Tristesse',
    (1, -1): 'Calme'
}

run_pipeline(
    input_path='raw_detection.csv',
    output_path='cleaned_data_detection.csv',
)

df = pd.read_csv('cleaned_data_detection.csv')
sample_features = extract_features(df, mode='sample_test')

baseline = pd.read_csv('features_baseline.csv')

ML_sample = sample_features - baseline

clf = joblib.load('model_logistic_regression')

y = clf.predict(ML_sample)
y = tuple(y[0]) 
y = emotion_encoding[y]

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