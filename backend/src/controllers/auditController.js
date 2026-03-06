const AuditLog = require('../models/AuditLog');
const { logAction } = require('../utils/auditUtils');

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

exports.create = async (req, res, next) => {
  try {
    const { type, message } = req.body;
    await logAction(req.user?.email, type, message, req);
    res.status(201).json({ message: 'Logged' });
  } catch (err) { next(err); }
};
