const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bookingsController = require('../controllers/bookingsController');

// Hämta alla bokningar (Admin)
router.get('/all', auth, admin, bookingsController.getAllBookings);
router.get('/:id', auth, admin, bookingsController.getBookingById);
router.put('/:id', auth, admin, bookingsController.updateBookingStatus);

module.exports = router;
