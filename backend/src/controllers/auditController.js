const AuditLog = require('../models/AuditLog');

exports.list = async (req, res, next) => {
  try {
    const items = await AuditLog.find().sort('-createdAt').limit(500);
    res.json(items);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const item = await AuditLog.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};
