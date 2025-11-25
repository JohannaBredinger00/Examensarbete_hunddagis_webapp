const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');

// Register ny användare
router.post('/register', usersController.register);

// Login
router.post('/login', usersController.login);

//Hämta profil
router.get('/myprofile', auth, usersController.getMyProfile);

//Uppdatera profil
router.put('/myprofile', auth, usersController.updateMyProfile);

module.exports = router;
