const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
  committeeNumber: { type: String },
  member1: { type: String },
  member2: { type: String },
  member3: { type: String },
  additionalMembers: [{ type: String }],
  appointedDate: { type: Date },
  status: { type: String, default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Committee', committeeSchema);
