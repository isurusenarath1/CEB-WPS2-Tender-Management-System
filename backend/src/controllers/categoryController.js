const Category = require('../models/Category');
const AuditLog = require('../models/AuditLog');

exports.list = async (req, res, next) => {
  try {
    const items = await Category.find().sort('-createdAt');
    res.json(items);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Category.create(req.body);
    await AuditLog.create({ 
      user: req.user?.email, 
      type: 'create:category', 
      message: `Created category ${item.name}` 
    });
    res.status(201).json(item);
  } catch (err) { 
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    next(err); 
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Category.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    
    await AuditLog.create({ 
      user: req.user?.email, 
      type: 'update:category', 
      message: `Updated category ${item.name}` 
    });
    res.json(item);
  } catch (err) { 
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    next(err); 
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Category.findByIdAndDelete(req.params.id);
    if (item) {
      await AuditLog.create({ 
        user: req.user?.email, 
        type: 'delete:category', 
        message: `Deleted category ${item.name}` 
      });
    }
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
