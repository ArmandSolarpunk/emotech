import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, confusion_matrix, classification_report, accuracy_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns



data =  pd.read_csv('C:/Users/arman/Desktop/Premierprojet/data/machineLearning.csv')

X = data[['PPG_GRN_mean','PPG_GRN_std','PPG_IR_mean','PPG_IR_std','PPG_RED_mean','PPG_RED_std','TEMP1_mean','TEMP1_std','PPG_IR_HR_brut_mean','PPG_IR_HR_brut_std','PPG_IR_HR_brut_rmssd','PPG_GRN_HR_brut_mean','PPG_GRN_HR_brut_std','PPG_GRN_HR_brut_rmssd','PPG_RED_HR_brut_mean','PPG_RED_HR_brut_std','PPG_RED_HR_brut_rmssd','PPG_IR_IBI_brut_mean','PPG_IR_IBI_brut_std','PPG_IR_IBI_brut_rmssd','PPG_GRN_IBI_brut_mean','PPG_GRN_IBI_brut_std','PPG_GRN_IBI_brut_rmssd','PPG_RED_IBI_brut_mean','PPG_RED_IBI_brut_std','PPG_RED_IBI_brut_rmssd']]
y = data[['valence','arousal']]

X_train, X_test, y_train, y_test = train_test_split( X, y, train_size=0.8, random_state=808, stratify=y)

"""
random forest
tree_counts = [1,2,3,4,5,10,15,20,25,30,40,50, 60, 70, 80, 90, 100, 110, 120]

GOOD BETWEEN 20 AND 60 
for n_estimator in tree_counts:
accuracy  = []

clf = RandomForestClassifier(
     n_estimators = 60,
    max_depth = 2,
    random_state = 8
    )

clf.fit(X_train, y_train)
accuracy.append(clf.score(X_test, y_test))

print(accuracy)    

sns.lineplot(x=tree_counts, y=accuracy)
plt.xlabel('tree_counts')
plt.ylabel('accuracy_score')
plt.title('accuracy')
plt.grid()
plt.show()


avec 20
[0.4722222222222222]
train 0.8414961109961566
test 0.6454393942580573
[[ 0  2  0  2  0  1]
 [ 0 10  0  0  0  1]
 [ 0  1  0  1  0  1]
 [ 0  2  0  3  0  2]
 [ 0  0  0  2  0  0]
 [ 0  3  0  1  0  4]]
              precision    recall  f1-score   support

         1.0       0.00      0.00      0.00         5
         2.0       0.56      0.91      0.69        11
         3.0       0.00      0.00      0.00         3
         4.0       0.33      0.43      0.38         7
         5.0       0.00      0.00      0.00         2
         6.0       0.44      0.50      0.47         8

    accuracy                           0.47        36
   macro avg       0.22      0.31      0.26        36
weighted avg       0.33      0.47      0.39        36
"""





"""
!!!!!!!!!!!!!!!!!SANS LE EDA!!!!!!!!!!!!
regression logistique 
train 0.7301393328179236
test 0.7323340904574547
[[ 1  1  0  2  0  1]
 [ 0 10  0  0  0  1]
 [ 0  1  0  0  0  2]
 [ 0  7  0  0  0  0]
 [ 0  1  0  1  0  0]
 [ 0  2  1  1  0  4]]

              precision    recall  f1-score   support

         1.0       1.00      0.20      0.33         5
         2.0       0.45      0.91      0.61        11
         3.0       0.00      0.00      0.00         3
         4.0       0.00      0.00      0.00         7
         5.0       0.00      0.00      0.00         2
         6.0       0.50      0.50      0.50         8

    accuracy                           0.42        36
   macro avg       0.33      0.27      0.24        36
weighted avg       0.39      0.42      0.34        36
"""
clf = LogisticRegression(random_state=808).fit(X, y)

features = X.columns
coefs = clf.coef_  # shape = (n_classes, n_features)

# On met ça dans un DataFrame
coef_df = pd.DataFrame(coefs.T, columns=[f"Class_{cls}" for cls in clf.classes_])
coef_df['Feature'] = features
coef_df.set_index('Feature', inplace=True)

plt.figure(figsize=(12, 8))
sns.heatmap(coef_df, annot=True, cmap="coolwarm", center=0)
plt.title("Coefficients des features (Logistic Regression)")
plt.tight_layout()
plt.show()



"""
importances = clf.feature_importances_
features = X.columns

# Affichage sous forme de DataFrame triée
importances_df = pd.DataFrame({'Feature': features, 'Importance': importances})
importances_df = importances_df.sort_values(by='Importance', ascending=False)

# Affichage graphique
plt.figure(figsize=(10, 6))
sns.barplot(x='Importance', y='Feature', data=importances_df)
plt.title('Feature Importance (Random Forest)')
plt.tight_layout()
plt.show()
"""

"""
train_auc = roc_auc_score(y_train, clf.predict_proba(X_train), multi_class='ovr')
test_auc = roc_auc_score(y_test, clf.predict_proba(X_test), multi_class='ovr')
print("train",train_auc)
print("test", test_auc)

y_train_hat = clf.predict(X_train)
y_test_hat = clf.predict(X_test)
print(confusion_matrix(y_test, y_test_hat))
print(classification_report(y_test, y_test_hat))

joblib.dump(clf,'model_logistic_regression')
"""