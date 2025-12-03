const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const dogsController = require('../controllers/dogsController');

// Alla routes kräver inloggning
router.get('/mydogs', auth, dogsController.getMyDogs);
router.post('/add', auth, dogsController.addDog);
router.put('/:id', auth, dogsController.updateDog);
router.delete('/:id', auth, dogsController.deleteDog);

module.exports = router;