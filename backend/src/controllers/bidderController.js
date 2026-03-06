const Bidder = require('../models/Bidder');
const { logAction } = require('../utils/auditUtils');

exports.list = async (req, res, next) => {
  try {
    const items = await Bidder.find().sort('-createdAt');
    res.json(items);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Bidder.create(req.body);
    await logAction(req.user?.email, 'Create', `Created bidder ${item.name}`, req);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Bidder.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Bidder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (item) {
      await logAction(req.user?.email, 'Update', `Updated bidder ${item.name}`, req);
    }
    res.json(item);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Bidder.findByIdAndDelete(req.params.id);
    if (item) {
      await logAction(req.user?.email, 'Delete', `Deleted bidder ${item.name}`, req);
    }
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
