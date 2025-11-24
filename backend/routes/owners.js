const express = require('express');
const router = express.Router();
const ownersController = require('../controllers/ownersController');
const auth = require('../middleware/auth');

router.get('/myprofile', auth, ownersController.getMyProfile);
router.put('/myprofile', auth, ownersController.updateMyProfile);
router.get('/all', auth, ownersController.getAllOwners); // Admin only

module.exports = router;