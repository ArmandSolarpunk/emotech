import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, confusion_matrix, classification_report, accuracy_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns



data =  pd.read_csv('C:/Users/arman/Desktop/Premierprojet/data/testML.csv', on_bad_lines='skip')

X = data[['EDA_mean','EDA_std','PPG_GRN_mean','PPG_GRN_std','PPG_IR_mean','PPG_IR_std','PPG_RED_mean',
          'PPG_RED_std','TEMP1_mean','TEMP1_std','PPG_IR_HR_brut_mean','PPG_IR_HR_brut_std','PPG_GRN_HR_brut_mean',
          'PPG_GRN_HR_brut_std','PPG_RED_HR_brut_mean','PPG_RED_HR_brut_std','PPG_IR_IBI_brut_mean',
          'PPG_IR_IBI_brut_std','PPG_GRN_IBI_brut_mean','PPG_GRN_IBI_brut_std','PPG_RED_IBI_brut_mean',
          'PPG_RED_IBI_brut_std',
          ]]


y = data['arousal']

X_train, X_test, y_train, y_test = train_test_split( X, y, train_size=0.8, random_state=808, stratify=y)



clf = LogisticRegression(random_state=808).fit(X_train, y_train)


train_auc = roc_auc_score(y_train, clf.predict_proba(X_train)[:, 1])
test_auc = roc_auc_score(y_test, clf.predict_proba(X_test)[:, 1])
"""

train_auc = roc_auc_score(y_train, clf.predict_proba(X_train), multi_class='ovr')
test_auc = roc_auc_score(y_test, clf.predict_proba(X_test), multi_class='ovr')"""


print("train",train_auc)
print("test", test_auc)

y_train_hat = clf.predict(X_train)
y_test_hat = clf.predict(X_test)
print(confusion_matrix(y_test, y_test_hat))
print(classification_report(y_test, y_test_hat))


feature_names = X.columns
coefficients = clf.coef_
if coefficients.shape[0] == 1:
    # Cas binaire
    importance_df = pd.DataFrame({
        'Feature': feature_names,
        'Coefficient': coefficients[0]
    }).sort_values(by='Coefficient', key=abs, ascending=False)
else:
    # Cas multiclasse
    for i, class_label in enumerate(clf.classes_):
        print(f"\n--- Importances pour la classe '{class_label}' ---")
        class_importance_df = pd.DataFrame({
            'Feature': feature_names,
            'Coefficient': coefficients[i]
        }).sort_values(by='Coefficient', key=abs, ascending=False)
        print(class_importance_df.to_string(index=False))

plt.figure(figsize=(10,6))
plt.barh(feature_names, coefficients[0])
plt.title('Importance des features (coefs régression logistique)')
plt.xlabel('Coefficient')
plt.grid(True)
plt.tight_layout()
plt.show()


"""joblib.dump(clf,'model_logistic_regression')"""