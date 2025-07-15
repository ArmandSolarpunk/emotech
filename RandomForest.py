import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, confusion_matrix, classification_report, accuracy_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.inspection import permutation_importance

data =  pd.read_csv('C:/Users/arman/Desktop/Premierprojet/data/testML.csv')

X = data[['EDA_mean','EDA_std','PPG_GRN_mean','PPG_GRN_std','PPG_IR_mean','PPG_IR_std','PPG_RED_mean','PPG_RED_std','TEMP1_mean','TEMP1_std','PPG_IR_HR_brut_mean','PPG_IR_HR_brut_std','PPG_GRN_HR_brut_mean','PPG_GRN_HR_brut_std','PPG_RED_HR_brut_mean','PPG_RED_HR_brut_std','PPG_IR_IBI_brut_mean','PPG_IR_IBI_brut_std','PPG_GRN_IBI_brut_mean','PPG_GRN_IBI_brut_std','PPG_RED_IBI_brut_mean','PPG_RED_IBI_brut_std']]


y = data['valence']

X_train, X_test, y_train, y_test = train_test_split( X, y, train_size=0.8, random_state=808, stratify=y)

"""
tree_counts = [1,2,3,4,5,10,15,20,25,30,40,50, 60, 70, 80, 90, 100, 110, 120]
tree_counts = [ 1,2,3,4,5,6,7,8,9,10]
accuracy  = []
for n_estimator in tree_counts:

 accuracy.append(clf.score(X_test, y_test))
print(accuracy)


sns.lineplot(x=tree_counts, y=accuracy)
plt.xlabel('tree_counts')
plt.ylabel('accuracy_score')
plt.title('accuracy')
plt.grid()
plt.show()
    
#GOOD BETWEEN 20 AND 60 

"""




     
clf = RandomForestClassifier(
n_estimators = 10,
max_depth = 2,
random_state = 8,
class_weight='balanced'
)

clf.fit(X_train, y_train)
"""
train_auc = roc_auc_score(y_train, clf.predict_proba(X_train), multi_class='ovr')
test_auc = roc_auc_score(y_test, clf.predict_proba(X_test), multi_class='ovr')
"""
train_auc = roc_auc_score(y_train, clf.predict_proba(X_train)[:, 1])
test_auc = roc_auc_score(y_test, clf.predict_proba(X_test)[:, 1])

print("train",train_auc)
print("test", test_auc)

y_train_hat = clf.predict(X_train)
y_test_hat = clf.predict(X_test)
print(confusion_matrix(y_test, y_test_hat))
print(classification_report(y_test, y_test_hat))


result = permutation_importance(clf, X_test, y_test, n_repeats=30, random_state=808, n_jobs=-1)


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