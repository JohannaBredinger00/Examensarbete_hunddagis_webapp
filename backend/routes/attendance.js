const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const attendanceController = require('../controllers/attendanceController');


router.get('/today', auth, admin, attendanceController.getTodayAttendance);
router.post('/:bookingId/checkin', auth, admin, attendanceController.checkIn);
router.post('/:bookingId/checkout', auth, admin, attendanceController.checkOut);

module.exports = router; 