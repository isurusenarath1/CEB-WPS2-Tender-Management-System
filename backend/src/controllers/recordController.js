const Record = require('../models/Record');
const { logAction } = require('../utils/auditUtils');

exports.list = async (req, res, next) => {
  try {
    const items = await Record.find().sort('-createdAt');
    res.json(items);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Record.create(req.body);
    await logAction(req.user?.email, 'Create', `Created record ${item.tenderNumber}`, req);
    res.status(201).json(item);
  } catch (err) { 
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Tender number already exists' });
    }
    next(err); 
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Record.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    
    await logAction(req.user?.email, 'Update', `Updated record ${item.tenderNumber}`, req);
    res.json(item);
  } catch (err) { 
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Tender number already exists' });
    }
    next(err); 
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Record.findByIdAndDelete(req.params.id);
    if (item) {
      await logAction(req.user?.email, 'Delete', `Deleted record ${item.tenderNumber}`, req);
    }
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
