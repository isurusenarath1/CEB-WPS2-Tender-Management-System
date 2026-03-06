const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/auditController');

router.get('/', auth, ctrl.list);
router.post('/', auth, ctrl.create);
router.get('/:id', auth, ctrl.get);

module.exports = router;
