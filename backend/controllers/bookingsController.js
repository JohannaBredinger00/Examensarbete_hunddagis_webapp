const db = require('../db');

// -------------------------
// User: Hämta egna bokningar
// -------------------------
const getMyBookings = async (req, res) => {
    const userId = req.userId;

    try {
        const [bookings] = await db.execute(`
            SELECT b.*,
                   d.name AS dog_name,
                   d.breed
            FROM bookings b
            JOIN dogs d ON b.dog_id = d.id
            JOIN owners o ON d.owner_id = o.id
            WHERE o.user_id = ?
            ORDER BY b.date DESC
        `, [userId]);

        res.json(bookings);
    } catch (error) {
        console.error("SQL ERROR:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// -------------------------
// User: Skapa ny bokning
// -------------------------
const createBooking = async (req, res) => {
    const { dog_id, date, type } = req.body;
    const userId = req.userId;

    console.log('Inserting booking:', { dog_id, date, type });


    try {
        if (!dog_id || !date || !type) {
            return res.status(400).json({ message: 'Alla fält krävs' });
        }

        const [validDog] = await db.execute(`
            SELECT d.id FROM dogs d
            JOIN owners o ON d.owner_id = o.id
            WHERE d.id = ? AND o.user_id = ?
        `, [dog_id, userId]);

        if (validDog.length === 0) {
            return res.status(403).json({ message: 'Hunden finns inte' });
        }

        const [existing] = await db.execute(
            'SELECT id FROM bookings WHERE dog_id = ? AND date = ?',
            [dog_id, date]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Redan bokad denna dag' });
        }

        const [result] = await db.execute(
            'INSERT INTO bookings (dog_id, date, type) VALUES (?, ?, ?)',
            [dog_id, date, type]
        );

        res.status(201).json({ message: 'Bokning skapad', bookingId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// -------------------------
// User: Uppdatera bokning
// -------------------------
const updateBooking = async (req, res) => {
    const { id } = req.params;
    const { status, date, type } = req.body;
    const userId = req.userId;

    try {
        const fields = [];
        const values = [];

        if (status) {
            fields.push("b.status = ?");
            values.push(status);
        }
        if (date) {
            fields.push("b.date = ?");
            values.push(date);
        }
        if (type) {
            fields.push("b.type = ?");
            values.push(type);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: "Inga ändringar skickades." });
        }

        values.push(id, userId);

        const sql = `
            UPDATE bookings b
            JOIN dogs d ON b.dog_id = d.id
            JOIN owners o ON d.owner_id = o.id
            SET ${fields.join(", ")}
            WHERE b.id = ? AND o.user_id = ?
        `;

        const [result] = await db.execute(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bokning ej hittad' });
        }

        res.json({ message: 'Bokning uppdaterad' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// -------------------------
// User: Ta bort bokning
// -------------------------
const deleteBooking = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const [result] = await db.execute(`
            DELETE b FROM bookings b
            JOIN dogs d ON b.dog_id = d.id
            JOIN owners o ON d.owner_id = o.id
            WHERE b.id = ? AND o.user_id = ?
        `, [id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Bokning ej hittad" });
        }

        res.json({ message: "Bokning borttagen" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// -------------------------
// Admin: Hämta alla bokningar
// -------------------------
const getAllBookings = async (req, res) => {
    try {
        const [bookings] = await db.execute(`
            SELECT b.*, d.name AS dog_name, u.name AS owner_name, u.email AS owner_email
            FROM bookings b
            JOIN dogs d ON b.dog_id = d.id
            JOIN owners o ON d.owner_id = o.id
            JOIN users u ON o.user_id = u.id
        `);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err });
    }
};

const getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(`
      SELECT b.*, d.name AS dog_name, u.name AS owner_name
      FROM bookings b
      JOIN dogs d ON b.dog_id = d.id
      JOIN owners o ON d.owner_id = o.id
      JOIN users u ON o.user_id = u.id
      WHERE b.id = ?
    `, [id]);

    if (result.length === 0) return res.status(404).json({ message: "Booking not found" });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const [result] = await db.execute(`
      UPDATE bookings
      SET status = ?
      WHERE id = ?
    `, [status, id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// -------------------------
// Exportera alla funktioner
// -------------------------
module.exports = {
    getMyBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus
};
