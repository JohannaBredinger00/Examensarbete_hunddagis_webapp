const db = require('../db');

exports.getTodayAttendance = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.booking_id AS bookingId, a.checked_in AS status, 
             b.type, d.name AS dogName, u.name AS ownerName, a.checked_in, a.checked_out
      FROM attendance a
      JOIN bookings b ON a.booking_id = b.id
      JOIN dogs d ON b.dog_id = d.id
      JOIN owners o ON d.owner_id = o.id
      JOIN users u ON o.user_id = u.id
      WHERE b.date = CURDATE()
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
