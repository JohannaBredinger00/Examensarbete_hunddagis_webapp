const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');
const auth = require('../middleware/auth');

router.get('/mybookings', auth, bookingsController.getMyBookings);
router.post('/', auth, bookingsController.createBooking);
router.put('/:id', auth, bookingsController.updateBooking);
router.delete('/:id', auth, bookingsController.deleteBooking);

module.exports = router;