// ==========================
//  IMPORTS DE MODULES
// ==========================

// Framework pour créer le serveur web et gérer les routes
const express = require('express');

// Pour lire et écrire des fichiers sur le disque (CSV notamment)
const fs = require('fs');

// Pour gérer les chemins de fichiers de façon portable (Windows, Linux, etc.)
const path = require('path');

// Pour se connecter à MongoDB, une base de données NoSQL
const mongoose = require('mongoose');

// Pour exécuter des scripts Python depuis Node.js
const { spawn } = require('child_process');

// Modèle Mongoose pour interagir avec la base de données
const Emotech = require('./models/Emotech');

// ==========================
//  CONNEXION À MONGODB
// ==========================

// Connexion à la base MongoDB Atlas via une URL de cluster
mongoose.connect('mongodb+srv://stagehumantech:kVX3bJ2mBOZ9YFxq@cluster0.d9icoz5.mongodb.net/', 
  { useNewUrlParser: true, useUnifiedTopology: true }) // options modernes recommandées
  .then(() => console.log('Connexion à MongoDB réussie !'))  // succès
  .catch(() => console.log('Connexion à MongoDB échouée !')); // échec

// ==========================
//  INITIALISATION DE L'APPLICATION
// ==========================

const app = express();           // création de l'app Express
let pythonProcess = null;        // variable pour suivre le script Python d'enregistrement

app.use(express.json());         // permet de lire le JSON envoyé par le frontend

// ==========================
//  GESTION DU CORS
// ==========================

// Middleware pour permettre les requêtes cross-origin depuis le frontend
// Utile surtout si le front est hébergé ailleurs (localhost:3000 ↔ localhost:4200)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // autorise toutes les origines
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// ==========================
//  ENREGISTREMENT CSV DEPUIS LE FRONTEND
// ==========================

app.post('/save-csv', (req, res) => {
  try {
    const { situationoeil, timestamp, emotionsResentis, commentaires } = req.body;

    let csvContent = 'situationoeil,timestamp,emotionsResentis,commentaires\n';

    // On écrit chaque ligne du CSV à partir des tableaux
    for (let i = 0; i < timestamp.length; i++) {
      csvContent += `"${situationoeil[i]}",${timestamp[i]},"${emotionsResentis[i]}","${commentaires[i]}"\n`;
    }

    // On sauvegarde le CSV à la racine du projet
    const filePath = path.join(__dirname, 'data_platform.csv');
    fs.writeFileSync(filePath, csvContent);

    res.status(200).json({ message: 'CSV enregistré avec succès', filePath });
  } catch (error) {
    console.error('Erreur enregistrement CSV :', error);
    res.status(500).json({ error: 'Erreur lors de l’enregistrement du CSV' });
  }
});

// ==========================
//  SAUVEGARDE LOCALE DES DONNÉES TRAITÉES
// ==========================

// Fonction pour créer un dossier par utilisateur et copier les fichiers importants
const saveLocalData = (userId) => {
  const baseDir = path.join(__dirname, 'base_de_donnee', `user_${userId}_${Date.now()}`);

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });  // crée le dossier s’il n’existe pas
  }

  const files = ['data_platform.csv', 'raw.csv', 'cleaned_data.csv', 'features_extracted.csv', 'relative_features.csv'];

  files.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(baseDir, file);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });

  console.log(`Données sauvegardées localement dans ${baseDir}`);
  return baseDir;
};

// ==========================
//  DÉMARRER L'ENREGISTREMENT (Script Python)
// ==========================

app.get('/start-recording', (req, res) => {
  if (pythonProcess) {
    return res.status(400).send('Le script Python est déjà en cours d\'exécution.');
  }

  // Lance le script Python qui lit les données LSL
  pythonProcess = spawn('python', ['C:/Users/arman/Desktop/Premierprojet/backend/lsl_reader.py']);

  // Affiche les logs de sortie du script Python
  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python output: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    pythonProcess = null;
  });

  res.send('Enregistrement démarré.');
});

// ==========================
// ARRÊTER L'ENREGISTREMENT + LANCER LE TRAITEMENT
// ==========================

app.get('/stop-recording', (req, res) => {
  if (!pythonProcess) {
    return res.status(400).send('Aucun script Python en cours d\'exécution.');
  }

  pythonProcess.kill();        // stoppe le script de collecte LSL
  pythonProcess = null;

  console.log('Python script stopped.');

  // Démarre un script Python de traitement (nettoyage + extraction de features)
  const pythonProcess2 = spawn('python', ['C:/Users/arman/Desktop/Premierprojet/backend/data_process.py']);

  pythonProcess2.stdout.on('data', (data) => {
    console.log(`Python output: ${data}`);
  });

  pythonProcess2.stderr.on('data', (data) => {
    console.error(`Python error: ${data}`);
  });

  // Une fois le traitement terminé, on lit les fichiers générés et on les sauvegarde dans MongoDB
  pythonProcess2.on('close', async (code) => {
    console.log(`Python script exited with code ${code}`);

    if (code !== 0) {
      return res.status(500).json({ error: 'Erreur lors du traitement Python.' });
    }

    try {
      const platformData = fs.readFileSync(path.join(__dirname, 'data_platform.csv'), 'utf-8');
      const rawData = fs.readFileSync(path.join(__dirname, 'raw.csv'), 'utf-8');
      const cleanData = fs.readFileSync(path.join(__dirname, 'cleaned_data.csv'), 'utf-8');
      const featureData = fs.readFileSync(path.join(__dirname, 'features_extracted.csv'), 'utf-8');
      const VarFeatureData = fs.readFileSync(path.join(__dirname, 'relative_features.csv'), 'utf-8');

      // On crée une nouvelle entrée dans MongoDB
      const emotech = new Emotech({
        id: Date.now(),
        plateform: platformData,
        rawData: rawData,
        CleanData: cleanData,
        processedFeatures: featureData,
        variationFeatures: VarFeatureData
      });

      await emotech.save(); // Sauvegarde dans MongoDB
      console.log('Données enregistrées dans MongoDB.');

      const localPath = saveLocalData(emotech.id); // Sauvegarde locale
      console.log(`Données également sauvegardées dans le dossier local : ${localPath}`);

      res.send('Traitement terminé et données enregistrées dans MongoDB.');
    } catch (err) {
      console.error('Erreur sauvegarde MongoDB :', err);
      res.status(500).json({ error: 'Erreur lors de la sauvegarde dans MongoDB. Vérifiez que tous les fichiers CSV existent.' });
    }
  });
});


// ==========================
//  ENREGISTREMENT MANUEL D’UNE ÉMOTION
// ==========================

app.post('/api/emotion', (req, res) => {
  console.log('Reçu :', req.body);

  const emotech = new Emotech({ ...req.body }); // crée un objet à partir du body

  emotech.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
});


// ==========================
//  RÉCUPÉRATION DES ENTRÉES EN BASE
// ==========================

app.get('/api/emotion', (req, res) => {
  Emotech.find() // récupère tous les documents dans la collection
    .then(emotechs => res.status(200).json(emotechs))
    .catch(error => res.status(400).json({ error }));
});


// ==========================
//  EXPORT DE L'APPLICATION POUR LE SERVEUR
// ==========================

module.exports = app; // nécessaire pour pouvoir utiliser app dans server.js

