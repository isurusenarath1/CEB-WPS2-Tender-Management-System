const Committee = require('../models/Committee');
const AuditLog = require('../models/AuditLog');

exports.list = async (req, res, next) => {
  try {
    const items = await Committee.find().sort('-createdAt');
    res.json(items);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Committee.create(req.body);
    await AuditLog.create({ user: req.user?.email, type: 'create:committee', message: `Created committee ${item.committeeNumber || item._id}` });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Committee.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Committee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Committee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
