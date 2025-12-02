const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminDogsController = require('../controllers/adminDogsController');

// Hämta alla hundar (Admin)
router.get('/all', auth, admin, adminDogsController.getAllDogs);
router.get('/:id', auth, admin, adminDogsController.getDogById);

module.exports = router;
