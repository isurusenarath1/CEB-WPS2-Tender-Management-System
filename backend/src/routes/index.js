const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/categories', require('./categories'));
router.use('/bidders', require('./bidders'));
router.use('/staff', require('./staff'));
router.use('/records', require('./records'));
router.use('/departments', require('./departments'));
router.use('/committees', require('./committees'));
router.use('/users', require('./users'));
router.use('/audits', require('./audits'));

module.exports = router;
