const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
  committeeNumber: { type: String, required: true, unique: true, trim: true },
  member1: { type: String, required: true, trim: true },
  member2: { type: String, required: true, trim: true },
  member3: { type: String, required: true, trim: true },
  additionalMembers: [{ type: String }],
  appointedDate: { type: Date, required: true },
  status: { type: String, default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Committee', committeeSchema);
