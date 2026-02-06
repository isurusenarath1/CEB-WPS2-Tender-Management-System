const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  tenderNumber: { type: String, required: true },
  relevantTo: { type: String },
  category: { type: String },
  description: { type: String },
  other: { type: String },
  bidStartDate: { type: Date },
  bidOpenDate: { type: Date },
  bidClosingDate: { type: Date },
  approvedDate: { type: Date },
  fileSentToTecDate: { type: Date },
  remark: { type: String },
  status: { type: String },
  tecChairman: { type: String },
  tecMember1: { type: String },
  tecMember2: { type: String },
  awardedTo: { type: String },
  performanceBondNumber: { type: String },
  performanceBondBank: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
