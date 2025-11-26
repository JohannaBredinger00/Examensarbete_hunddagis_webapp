const express = require('express');
const router = express.Router();
const dogsController = require('../controllers/dogsController');
const auth = require('../middleware/auth');

// Alla routes kräver inloggning
router.get('/mydogs', auth, dogsController.getMyDogs);
router.post('/add', auth, dogsController.addDog);
router.put('/:id', auth, dogsController.updateDog);
router.delete('/:id', auth, dogsController.deleteDog);

module.exports = router;