/**
 * fichier : Emotech.js
 * 
 * description : Modèle de ce que l'on va envoyer dans la base Mongo DB 
 * on transforme tous les fichier en chaine de caractères 
 * 
 */
const mongoose = require('mongoose');

const emotechSchema = mongoose.Schema({
  id: { type: Number, required: true },
  plateform: { type: String, required: true },
  rawData: { type: String, required: true },
  CleanData: { type: String, required: true },
  processedFeatures: { type: String, required: true },
  variationFeatures: { type: String, required: true }
});

module.exports = mongoose.model('Emotech', emotechSchema);
