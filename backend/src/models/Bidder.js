const mongoose = require('mongoose');

const bidderSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  address: { type: String },
  contact: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Bidder', bidderSchema);
