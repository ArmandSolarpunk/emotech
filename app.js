const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const Emotech = require('./models/Emotech');

// Connexion MongoDB
mongoose.connect('mongodb+srv://stagehumantech:kVX3bJ2mBOZ9YFxq@cluster0.d9icoz5.mongodb.net/', 
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
let pythonProcess = null;

app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Enregistrement CSV depuis le front
app.post('/save-csv', (req, res) => {
  try {
    const { situationoeil, timestamp, emotionsResentis, commentaires } = req.body;

    let csvContent = 'situationoeil,timestamp,emotionsResentis,commentaires\n';
    for (let i = 0; i < situationoeil.length; i++) {
      csvContent += `"${situationoeil[i]}",${timestamp[i]},"${emotionsResentis[i]}","${commentaires[i]}"\n`;
    }

    const filePath = path.join(__dirname, 'data_platform.csv');
    fs.writeFileSync(filePath, csvContent);

    res.status(200).json({ message: 'CSV enregistré avec succès', filePath });
  } catch (error) {
    console.error('Erreur enregistrement CSV :', error);
    res.status(500).json({ error: 'Erreur lors de l’enregistrement du CSV' });
  }
});

// Démarrage de l'enregistrement
app.get('/start-recording', (req, res) => {
  if (pythonProcess) {
    return res.status(400).send('Le script Python est déjà en cours d\'exécution.');
  }

  pythonProcess = spawn('python', ['C:/Users/arman/Desktop/Premierprojet/backend/lsl_reader.py']);

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

// Arrêt de l'enregistrement + traitement
app.get('/stop-recording', (req, res) => {
  if (!pythonProcess) {
    return res.status(400).send('Aucun script Python en cours d\'exécution.');
  }

  pythonProcess.kill();
  pythonProcess = null;
  console.log('Python script stopped.');

  // Lancer le traitement Python
  const pythonProcess2 = spawn('python', ['C:/Users/arman/Desktop/Premierprojet/backend/data_process.py']);

  pythonProcess2.stdout.on('data', (data) => {
    console.log(`Python output: ${data}`);
  });

  pythonProcess2.stderr.on('data', (data) => {
    console.error(`Python error: ${data}`);
  });

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

      const emotech = new Emotech({
        id: Date.now(),
        plateform: platformData,
        rawData: rawData,
        CleanData: cleanData,
        processedFeatures: featureData
      });

      await emotech.save();
      console.log('Données enregistrées dans MongoDB.');

      res.send('Traitement terminé et données enregistrées dans MongoDB.');
    } catch (err) {
      console.error('Erreur sauvegarde MongoDB :', err);
      res.status(500).json({ error: 'Erreur lors de la sauvegarde dans MongoDB. Vérifiez que tous les fichiers CSV existent.' });
    }
  });
});

// Enregistrement manuel
app.post('/api/emotion', (req, res) => {
  console.log('Reçu :', req.body);

  const emotech = new Emotech({ ...req.body });

  emotech.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
});

// Récupération de toutes les entrées
app.get('/api/emotion', (req, res) => {
  Emotech.find()
    .then(emotechs => res.status(200).json(emotechs))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;
