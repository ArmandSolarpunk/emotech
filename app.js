const express = require('express');
const fs = require('fs');
const path = require('path');
// const mongoose = require('mongoose'); // <-- Commenté car MongoDB non utilisé offline
const { spawn } = require('child_process');
// const Emotech = require('./models/Emotech'); // <-- Commenté car dépend de MongoDB

/*
// Connexion MongoDB
mongoose.connect('mongodb+srv://stagehumantech:kVX3bJ2mBOZ9YFxq@cluster0.d9icoz5.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
*/

const app = express();
let pythonProcess = null;

app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Route pour sauvegarder les réponses du frontend en CSV
app.post('/save-csv', (req, res) => {
  try {
    const { situationoeil, timestamp, emotionsResentis, arousal, valence } = req.body;
    let csvContent = 'situationoeil,timestamp,emotionsResentis,arousal,valence \n';

    for (let i = 0; i < timestamp.length; i++) {
      csvContent += `"${situationoeil[i]}",${timestamp[i]},"${emotionsResentis[i]}","${arousal[i]}","${valence[i]}"\n`;
    }

    const filePath = path.join(__dirname, 'data_platform.csv');
    fs.writeFileSync(filePath, csvContent);

    res.status(200).json({ message: 'CSV enregistré avec succès', filePath });
  } catch (error) {
    console.error('Erreur enregistrement CSV :', error);
    res.status(500).json({ error: 'Erreur lors de l’enregistrement du CSV' });
  }
});

// Sauvegarde locale dans un dossier spécifique à l’utilisateur
const saveLocalData = (userId) => {
  const baseDir = path.join(__dirname, 'base_de_donnee', `user_${userId}_${Date.now()}`);

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  const files = ['data_platform.csv', 'raw.csv', 'cleaned_data.csv', 'features_extracted.csv', 'relative_features.csv'];
  files.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(baseDir, file);
    if (fs.existsSync(src)) fs.copyFileSync(src, dest);
  });

  return baseDir;
};

// Lancer un script Python (collecte de données LSL)
app.get('/start-recording', (req, res) => {
  if (pythonProcess) return res.status(400).send('Script Python déjà en cours.');
  const scriptPath = path.join(__dirname, 'lsl_reader.py');
  pythonProcess = spawn('python', [scriptPath]);

  pythonProcess.stdout.on('data', data => console.log(`Python output: ${data}`));
  pythonProcess.stderr.on('data', data => console.error(`Python error: ${data}`));
  pythonProcess.on('close', code => {
    console.log(`Script Python terminé avec code ${code}`);
    pythonProcess = null;
  });
  res.send('Enregistrement démarré.');
});

// Script Python pour la ligne de base
app.get('/baseline', (req, res) => {
  const scriptPath = path.join(__dirname, 'lsl_reader_baseline.py');
  pythonProcess = spawn('python', [scriptPath]);
  pythonProcess.stdout.on('data', data => console.log(`Python output: ${data}`));
  pythonProcess.stderr.on('data', data => console.error(`Python error: ${data}`));
  pythonProcess.on('close', code => {
    console.log(`Script Python terminé avec code ${code}`);
    pythonProcess = null;
  });
  res.send('Enregistrement baseline démarré.');
});

// Script pour la détection en temps réel
app.get('/startDetection', (req, res) => {
  const scriptPath = path.join(__dirname, 'lsl_reader_detection.py');
  pythonProcess = spawn('python', [scriptPath]);

  pythonProcess.stdout.on('data', data => console.log(`Python output: ${data}`));
  pythonProcess.stderr.on('data', data => console.error(`Python error: ${data}`));
  pythonProcess.on('close', code => {
    console.log(`Script Python terminé avec code ${code}`);
    pythonProcess = null;
  });
  res.send('Détection démarrée.');
});

app.get('/fin_detection', (req, res) => {
  const scriptPath = path.join(__dirname, 'newDB.py');
  pythonProcess = spawn('python', [scriptPath]);

  pythonProcess.stdout.on('data', data => console.log(`Python output: ${data}`));
  pythonProcess.stderr.on('data', data => console.error(`Python error: ${data}`));
  pythonProcess.on('close', code => {
    console.log(`Script Python terminé avec code ${code}`);
    pythonProcess = null;
  });
  res.send('Détection démarrée.');
});

// Arrêter le script et lancer le traitement
app.get('/stop-recording', (req, res) => {
  if (!pythonProcess) return res.status(400).send('Aucun script en cours.');
  pythonProcess.kill();
  pythonProcess = null;

  const pythonProcess2 = spawn('python', ['C:/Users/arman/Desktop/Premierprojet/backend/data_process.py']);
  pythonProcess2.stdout.on('data', data => console.log(`Python output: ${data}`));
  pythonProcess2.stderr.on('data', data => console.error(`Python error: ${data}`));

  pythonProcess2.on('close', async code => {
    if (code !== 0) return res.status(500).json({ error: 'Erreur traitement Python.' });

    try {
      const platformData = fs.readFileSync(path.join(__dirname, 'data_platform.csv'), 'utf-8');
      const rawData = fs.readFileSync(path.join(__dirname, 'raw.csv'), 'utf-8');
      const cleanData = fs.readFileSync(path.join(__dirname, 'cleaned_data.csv'), 'utf-8');
      const featureData = fs.readFileSync(path.join(__dirname, 'features_extracted.csv'), 'utf-8');
      const varFeatureData = fs.readFileSync(path.join(__dirname, 'relative_features.csv'), 'utf-8');

      /*
      // Enregistrement dans MongoDB désactivé pour usage hors-ligne
      const emotech = new Emotech({
        id: Date.now(),
        plateform: platformData,
        rawData,
        CleanData: cleanData,
        processedFeatures: featureData,
        variationFeatures: varFeatureData
      });

      await emotech.save();
      */

      // Sauvegarde locale uniquement
      const localPath = saveLocalData(Date.now());
      console.log(`Sauvegardé localement dans ${localPath}`);
      res.send('Traitement terminé et données sauvegardées localement.');
    } catch (err) {
      console.error('Erreur lecture/sauvegarde des fichiers CSV :', err);
      res.status(500).json({ error: 'Erreur locale. Vérifiez les fichiers CSV.' });
    }
  });
});

/*
// Enregistrement manuel d’une émotion — désactivé hors-ligne
app.post('/api/emotion', (req, res) => {
  const emotech = new Emotech({ ...req.body });
  emotech.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
});

// Récupération des enregistrements en base — désactivé hors-ligne
app.get('/api/emotion', (req, res) => {
  Emotech.find()
    .then(emotechs => res.status(200).json(emotechs))
    .catch(error => res.status(400).json({ error }));
});
*/

app.get('/stopBaseline', (req, res) => {
  if (!pythonProcess) return res.status(400).send('Aucun script en cours.');
  pythonProcess.kill();
  pythonProcess = null;

  const pythonProcess2 = spawn('python', ['C:/Users/arman/Desktop/Premierprojet/backend/data_process_baseline.py']);
  pythonProcess2.stdout.on('data', data => console.log(`Python output: ${data}`));
  pythonProcess2.stderr.on('data', data => console.error(`Python error: ${data}`));

  pythonProcess2.on('close', async code => {
    if (code !== 0) return res.status(500).json({ error: 'Erreur traitement Python.' });
  });

  res.status(200).json({ message: 'Traitement de la baseline terminé' });
});

app.get('/stopDetection', (req, res) => {
  if (!pythonProcess) return res.status(400).send('Aucun script en cours.');
  pythonProcess.kill();
  pythonProcess = null;

  const pythonProcess2 = spawn('python', ['C:/Users/arman/Desktop/Premierprojet/backend/data_process_detection.py']);

  let emotionDetected = "";

  pythonProcess2.stdout.on('data', data => {
    console.log(`Python output: ${data}`);
    emotionDetected += data.toString();
  });

  pythonProcess2.stderr.on('data', data => console.error(`Python error: ${data}`));

  pythonProcess2.on('close', async code => {
    if (code !== 0) return res.status(500).json({ error: 'Erreur traitement Python.' });

    emotionDetected = emotionDetected.trim();
    res.status(200).json({ emotion: emotionDetected });
  });
});

module.exports = app;