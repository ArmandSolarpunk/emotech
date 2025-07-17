import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.inspection import permutation_importance
"""

"""
# Charger les données
data = pd.read_csv('C:/Users/arman/Desktop/Premierprojet/data/finalML.csv')

# Features et label
X = data[['EDA_mean','EDA_std','PPG_GRN_mean','PPG_GRN_std','PPG_IR_mean','PPG_IR_std','PPG_RED_mean','PPG_RED_std',
          'TEMP1_mean','TEMP1_std','PPG_IR_HR_brut_mean','PPG_IR_HR_brut_std',
          'PPG_GRN_HR_brut_mean','PPG_GRN_HR_brut_std','PPG_RED_HR_brut_mean',
          'PPG_RED_HR_brut_std','PPG_IR_IBI_brut_mean','PPG_IR_IBI_brut_std',
          'PPG_GRN_IBI_brut_mean','PPG_GRN_IBI_brut_std',
          'PPG_RED_IBI_brut_mean','PPG_RED_IBI_brut_std']]

y = data['emotion_mapped']

# Séparer en train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, train_size=0.8, random_state=808)

# Standardiser les données
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
"""
C = [0.1, 1, 10, 100]
accuracy  = []
gamma= ['scale', 0.01, 0.1, 1]
for valeur in C :
    for i in gamma:


        accuracy.append(clf.score(X_test_scaled, y_test))
print(accuracy)


param_grid = {
    ,
    'gamma': ['scale', 0.01, 0.1, 1],
    'kernel': ['rbf']
}

grid = GridSearchCV(SVC(probability=True), param_grid, cv=5, scoring='accuracy', verbose=2)
grid.fit(X_train_scaled, y_train)

print("Meilleurs paramètres :", grid.best_params_)
print("Meilleure accuracy :", grid.best_score_)
"""

# Entraîner un SVM (noyau RBF par défaut)
clf = SVC(probability=True, kernel='rbf', C=1, gamma=0.01, random_state=808)
clf.fit(X_train_scaled, y_train)

# Prédictions
y_train_pred = clf.predict(X_train_scaled)
y_test_pred = clf.predict(X_test_scaled)

# Évaluation
print("Train Accuracy :", accuracy_score(y_train, y_train_pred))
print("Test Accuracy :", accuracy_score(y_test, y_test_pred))
print("\n Classification Report (Test) :\n", classification_report(y_test, y_test_pred))
print("Confusion Matrix (Test) :\n", confusion_matrix(y_test, y_test_pred))

result = permutation_importance(clf, X_test_scaled, y_test, n_repeats=30, random_state=808, n_jobs=-1)
feature_names = X.columns
importance_df = pd.DataFrame({
    'Feature': feature_names,
    'Importance': result.importances_mean
}).sort_values(by='Importance', ascending=False)

print(importance_df)

plt.figure(figsize=(10, 6))
sns.barplot(data=importance_df, y='Feature', x='Importance')
plt.title("Importance des features (Permutation Importance)")
plt.tight_layout()
plt.show()


"""joblib.dump(clf,'model_logistic_regression')"""