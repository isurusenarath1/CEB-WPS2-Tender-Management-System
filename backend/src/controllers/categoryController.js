const Category = require('../models/Category');
const { logAction } = require('../utils/auditUtils');

exports.list = async (req, res, next) => {
  try {
    const items = await Category.find().sort('-createdAt');
    res.json(items);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Category.create(req.body);
    await logAction(req.user?.email, 'Create', `Created category ${item.name}`, req);
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
    
    await logAction(req.user?.email, 'Update', `Updated category ${item.name}`, req);
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
      await logAction(req.user?.email, 'Delete', `Deleted category ${item.name}`, req);
    }
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
