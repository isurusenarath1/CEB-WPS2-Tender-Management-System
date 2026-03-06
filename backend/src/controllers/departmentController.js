const Department = require('../models/Department');
const { logAction } = require('../utils/auditUtils');

exports.list = async (req, res, next) => {
  try {
    const items = await Department.find().sort('-createdAt');
    res.json(items);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Department.create(req.body);
    await logAction(req.user?.email, 'Create', `Created department ${item.name} (${item.code})`, req);
    res.status(201).json(item);
  } catch (err) { 
    next(err); 
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Department.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    
    await logAction(req.user?.email, 'Update', `Updated department ${item.name}`, req);
    res.json(item);
  } catch (err) { 
    next(err); 
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Department.findByIdAndDelete(req.params.id);
    if (item) {
      await logAction(req.user?.email, 'Delete', `Deleted department ${item.name}`, req);
    }
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
