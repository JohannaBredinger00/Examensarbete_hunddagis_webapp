const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Register ny användare
router.post('/register', usersController.register);

// Login
router.post('/login', usersController.login);

module.exports = router;
