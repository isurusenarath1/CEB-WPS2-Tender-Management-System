const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');

exports.list = async (req, res, next) => {
  try {
    const items = await Department.find().sort('-createdAt');
    res.json(items);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Department.create(req.body);
    await AuditLog.create({ 
      user: req.user?.email, 
      type: 'create:department', 
      message: `Created department ${item.name} (${item.code})` 
    });
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
    
    await AuditLog.create({ 
      user: req.user?.email, 
      type: 'update:department', 
      message: `Updated department ${item.name}` 
    });
    res.json(item);
  } catch (err) { 
    next(err); 
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Department.findByIdAndDelete(req.params.id);
    if (item) {
      await AuditLog.create({ 
        user: req.user?.email, 
        type: 'delete:department', 
        message: `Deleted department ${item.name}` 
      });
    }
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
