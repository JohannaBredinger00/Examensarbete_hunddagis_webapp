const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const dogsController = require('../controllers/dogsController');
const upload = require('../middleware/upload');


router.post('/add', auth, upload.single('image'),dogsController.addDog);
router.put('/:id', auth, upload.single('image'), dogsController.updateDog);


// Alla routes kräver inloggning
router.get('/mydogs', auth, dogsController.getMyDogs);
router.post('/add', auth, dogsController.addDog);
router.put('/:id', auth, dogsController.updateDog);
router.delete('/:id', auth, dogsController.deleteDog);

module.exports = router;