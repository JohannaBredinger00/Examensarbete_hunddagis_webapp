const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminUsersController = require('../controllers/adminUsersController');

router.get('/', auth, admin, adminUsersController.getAllUsers);
router.get('/:id', auth, admin, adminUsersController.getUserById);

module.exports = router;
