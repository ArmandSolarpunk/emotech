const dgram = require('dgram');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const mongoose = require('mongoose');

const Emotech = require('./models/Emotech');
const udpServer = dgram.createSocket('udp4');

// Connexion MongoDB
mongoose.connect('mongodb+srv://stagehumantech:kVX3bJ2mBOZ9YFxq@cluster0.d9icoz5.mongodb.net/',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
let isRecording = false;
let dataBuffer = [];

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Réception des données UDP
udpServer.on('message', (msg) => {
  if (isRecording) {
    const data = msg.toString();
    console.log(`Data: ${data}`);
    dataBuffer.push(data);
  }
});
udpServer.bind(12346); // port oscillo

// Démarrage de l'enregistrement
app.get('/start-recording', (req, res) => {
  isRecording = true;
  dataBuffer = [];
  res.send('Enregistrement démarré');
});

// Arrêt de l'enregistrement + traitement
app.get('/stop-recording', (req, res) => {
  isRecording = false;

  const timestamp = Date.now();
  const filename = `emotibit_data_${timestamp}.csv`;
  const rawDir = path.join(__dirname, 'raw');
  const processedDir = path.join(__dirname, 'processed');

  if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir);
  if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir);

  const rawPath = path.join(rawDir, filename);
  const parsedPath = path.join(processedDir, filename.replace('.csv', '_Parsed.csv'));
  const processedPath = path.join(processedDir, filename.replace('.csv', '_FinalProcessed.csv'));

  // 1. Sauvegarder le fichier brut
  fs.writeFileSync(rawPath, dataBuffer.join('\n'));

  // 2. Appel du parser EmotiBit
  const parserExe = `"C:\\Program Files\\EmotiBit\\EmotiBit DataParser\\EmotiBitDataParser.exe"`;
  const parserCommand = `${parserExe} "${rawPath}"`;

  exec(parserCommand, (err, stdout, stderr) => {
    if (err) {
      console.error('Erreur parsing EmotiBit :', stderr);
      return res.status(500).send('Erreur parsing EmotiBit');
    }

    console.log('Parsing terminé.');

    // 3. Lancer le script Python
    const pythonCommand = `python science.py "${parsedPath}" "${processedPath}"`;

    exec(pythonCommand, (err, stdout, stderr) => {
      if (err) {
        console.error('Erreur dans le script Python :', stderr);
        return res.status(500).send('Erreur traitement Python');
      }

      console.log('Traitement Python terminé.');

      // 4. Enregistrement dans MongoDB
      const emotech = new Emotech({
      id: Date.now(), // ou tout autre identifiant unique que tu préfères
      situationoeil: [],
      timestamp: [],
      emotionsResentis: [],
      commentaires: [],
      rawCsvPath: rawFile,
      parsedCsvPath: parsedFolder,
      processedCsvPath: processedFile
      });

      emotech.save()
        .then(() => res.send('Enregistrement complet : brut, parsé, traité, et sauvegardé !'))
        .catch(error => {
          console.error("Erreur MongoDB :", error);
          res.status(500).send("Erreur lors de l'enregistrement MongoDB");
        });
    });
  });
});

// Enregistrement manuel de données
app.post('/api/emotion', (req, res) => {
  console.log("Reçu :", req.body);
  const emotech = new Emotech({ ...req.body });
  emotech.save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch(error => res.status(400).json({ error }));
});

// Récupération de toutes les entrées
app.use('/api/emotion', (req, res) => {
  Emotech.find()
    .then(emotechs => res.status(200).json(emotechs))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;