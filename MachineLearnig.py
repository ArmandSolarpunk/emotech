import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, confusion_matrix, classification_report, accuracy_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

data =  pd.read_csv('relative_features.csv')

X = data[['EDA_mean,EDA_std','PPG_GRN_mean','PPG_GRN_std','PPG_IR_mean','PPG_IR_std','PPG_RED_mean','PPG_RED_std','TEMP1_mean','TEMP1_std','PPG_IR_HR_brut_mean','PPG_IR_HR_brut_std','PPG_IR_HR_brut_rmssd','PPG_GRN_HR_brut_mean','PPG_GRN_HR_brut_std','PPG_GRN_HR_brut_rmssd','PPG_RED_HR_brut_mean','PPG_RED_HR_brut_std','PPG_RED_HR_brut_rmssd','PPG_IR_IBI_brut_mean','PPG_IR_IBI_brut_std','PPG_IR_IBI_brut_rmssd','PPG_GRN_IBI_brut_mean','PPG_GRN_IBI_brut_std','PPG_GRN_IBI_brut_rmssd','PPG_RED_IBI_brut_mean','PPG_RED_IBI_brut_std','PPG_RED_IBI_brut_rmssd']]
y = data.emotion.values

X_train, X_test, y_train, y_test = train_test_split( X, y, train_size=0.8, random_state=808)

"""
random forest

tree_counts = [1,2,3,4,5,10,15,20,25,30,40,50, 60, 70, 80, 90, 100, 110, 120]

accuracy  = []
for n_estimator in tree_counts:
    clf = RandomForestClassifier(
        n_estimators = n_estimator,
        max_depth = 2,
        random_state = 8
        )

    clf.fit(X_train, y_train)
    accuracy.append(clf.score(X_test, y_test))

print(accuracy)    
"""
"""
regression logistique 
"""
clf = LogisticRegression(random_state=808).fit(X, y)



train_auc = roc_auc_score(y_train, clf.predict_proba(X_train), multi_class='ovr')
test_auc = roc_auc_score(y_test, clf.predict_proba(X_test), multi_class='ovr')
print("train",train_auc)
print("test", test_auc)

y_train_hat = clf.predict(X_train)
y_test_hat = clf.predict(X_test)
print(confusion_matrix(y_test, y_test_hat))
print(classification_report(y_test, y_test_hat))

joblib.dump(clf,'model_logistic_regression')