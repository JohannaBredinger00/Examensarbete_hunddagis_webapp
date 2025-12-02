const db = require('../db');

// Hämta alla bokningar
exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, d.name AS dog_name, u.name AS owner_name
            FROM bookings b
            JOIN dogs d ON b.dog_id = d.id
            JOIN users u ON d.owner_id = u.id
            ORDER BY b.date DESC
    `);
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error', details: err });
  }
};

exports.getAllBookingById = async (req, res) => {
  const id = req.params.id;

  try{
    const [result] = await db.query(`
      SELECT b.*, d.name AS dog_name, u.name AS owner_name
            FROM bookings b
            JOIN dogs d ON b.dog_id = d.id
            JOIN users u ON d.owner_id = u.id
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
  const id = req.params.id;
  const { status } = req.body;

  try {
    await db.query(`UPDATE bookings SET status = ? WHERE id = ?`, [status, id]);
    res.json({ message: 'Booking updated'});
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err});
  }
};