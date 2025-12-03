const db = require('../db');

// Hämta alla bokningar
exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.execute(`
      SELECT b.id, b.date, b.type, b.status,
            d.name AS dogName,
            u.name AS ownerName, u.email AS ownerEmail,
      FROM bookings b
      JOIN dogs d ON b.dog_id = d.id
      JOIN owners o ON d.owner_id = o.id
      JOIN users u ON o.user_id = u.id = u.id
      ORDER BY b.date DESC
    `);
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error', details: err });
  }
};

exports.getBookingById = async (req, res) => {
  const { id } = req.params.id;
  try{
    const [result] = await db.execute(`
      SELECT b.id, b.date, b.type, b.status,
            d.name AS dogName,
            u.name AS ownerName, u.email AS ownerEmail
      FROM bookings b
      JOIN dogs d ON b.dog_id = d.id
      JOIN owners o ON d.owner_id = o.id
      JOIN users u ON o.user_id = u.id
      WHERE b.id = ?
      `, [id]);

      if(result.length === 0)
        return res.status(404).json({ error: "Booking not found"});

      res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params.id;
  const { status } = req.body;
  try {
    const [result] = await db.execute(
      `UPDATE bookings SET status = ? WHERE id = ?`,
      [status, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Booking not found "});
    res.json({ message: "Status updated"});
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err});
  }
};