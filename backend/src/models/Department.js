const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
  description: { type: String },
  headOfDepartment: { type: String },
  status: { type: String, default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
