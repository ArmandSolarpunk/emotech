const dgram = require('dgram');
const express = require('express');
const fs = require('fs');

const udpServer = dgram.createSocket('udp4');



const mongoose = require('mongoose');

const Emotech = require('./models/Emotech');


mongoose.connect('mongodb+srv://stagehumantech:kVX3bJ2mBOZ9YFxq@cluster0.d9icoz5.mongodb.net/',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

let isRecording = false;
let dataBuffer= [];


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

udpServer.on('message',(msg, rinfo)=>{
    if(isRecording){
        const data = msg.toString();
        console.log('Data:${data}');
        dataBuffer.push(data);
    }
});
udpServer.bind(12346); // port oscillo

app.get('/start-recording',(req,res,next)=>{
    isRecording = true;
    dataBuffer=[]; //vide le buffer
    res.send('Enregistrement démarré');

});

app.get('/stop-recording',(req,res,next)=>{
    isRecording = false;
    fs.writeFileSync('emotibit_data.csv',dataBuffer.join('\n'));
    res.send('Enregistrement arrété et données sauvgardées');
});

app.post('/api/emotion', (req, res, next) => {
    console.log("reçu : ",req.body);
   const emotech = new Emotech({
    ...req.body,
    //data:dataBuffer
   });
   emotech.save()
   .then(()=>res.status(201).json({message:"objet enregistré !"}))
   .catch(error=>res.status(400).json({error})
   );
});

app.use('/api/emotion', (req, res, next)=>{
    Emotech.find()
    .then(emotechs => res.status(200).json(emotechs))
    .catch(error => res.status(400).json({error}));
})

module.exports = app;


