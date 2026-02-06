const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  user: { type: String },
  type: { type: String },
  message: { type: String },
  ipAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditSchema);
