const db = require('../db');

exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await db.execute(`
      SELECT  b.id AS bookingId, b.type, b.status,
              b.checkin_time, b.checkout_time,
              d.id AS dogId, d.name AS dog_name,
              u.name AS owner_name, u.email AS ownerEmail
      FROM bookings b
      JOIN dogs d ON b.dog_id = d.id
      JOIN owners o ON d.owner_id = o.id
      JOIN users u ON o.user_id = u.id
      WHERE b.date = ? AND b.status IN ('booked', 'checked_in')
      ORDER BY d.name ASC

    `, [today]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.checkIn = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const [result] = await db.execute(
      `UPDATE bookings SET status='checked_in', checkin_time=NOW() WHERE id=?`,
      [bookingId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Booking not found"});
    res.json({ message: "Hund incheckad!"});
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message});
  }
};

exports.checkOut = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const [result] = await db.execute(
      `UPDATE bookings SET status='checked_out', checkout_time=NOW() WHERE id=?`,
      [bookingId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Booking not found"});
    res.json({ message: "Hund utcheckad!"});
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message});
  }
};
