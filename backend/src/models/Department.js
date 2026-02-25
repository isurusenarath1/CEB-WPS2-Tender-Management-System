const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, unique: true },
  description: { type: String },
  headOfDepartment: { type: String },
  status: { type: String, default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
