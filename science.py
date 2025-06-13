# import des librairies dont nous aurons besoin
import pandas as pd
import numpy as np
import re
import sys

# Lire le fichier CSV passé en argument
input_file = sys.argv[1]
output_file = sys.argv[2]

# Charger les données
df = pd.read_csv(input_file)

# Traitement exemple : moyenne glissant



# Sauver les données traitées
df.to_csv(output_file, index=False)