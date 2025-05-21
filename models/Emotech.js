const mongoose = require('mongoose');

const emotechSchema = mongoose.Schema({
  id : { type: Number },
  situationoeil: [{ type: mongoose.Schema.Types.Mixed }],
  timestamp: [{ type: mongoose.Schema.Types.Mixed }],
  emotionsResentis: [{ type: mongoose.Schema.Types.Mixed }]
});

module.exports = mongoose.model('Emotech', emotechSchema);