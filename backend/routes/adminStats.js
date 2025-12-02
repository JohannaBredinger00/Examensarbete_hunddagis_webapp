const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminStatsController = require('../controllers/adminStatsController');

router.get('/', auth, admin, adminStatsController.getStats);

module.exports = router;
