const colorSupport = require('color-support');
const db = require('../db');
const { message } = require('statuses');

// GET /api/bookings/mybookings - Hämta användarens bokningar
exports.getMyBookings = async (req, res) => {
    const userId = req.userId; 
    console.log("User ID from token:", userId);

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

        console.log("SQL RESULT:", bookings);
        res.json(bookings);
    } catch (error) {
        console.log("SQL ERROR:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/bookings - Skapa ny bokning
exports.createBooking = async (req, res) => {
    const { dog_id, date, type } = req.body;
    const userId = req.userId;

    try {
        if (!dog_id || !date || !type) {
            return res.status(400).json({ message: 'Alla fält krävs' });
        }

        // Kontrollera att hunden tillhör användaren
        const [validDog] = await db.execute(`
            SELECT d.id FROM dogs d
            JOIN owners o ON d.owner_id = o.id
            WHERE d.id = ? AND o.user_id = ?
        `, [dog_id, userId]);

        if (validDog.length === 0) {
            return res.status(403).json({ message: 'Hunden finns inte' });
        }

        // Kolla om det redan finns bokning samma dag för samma hund
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

        res.status(201).json({ 
            message: 'Bokning skapad', 
            bookingId: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PUT /api/bookings/:id - Avboka/uppdatera bokning (status, datum, typ)
exports.updateBooking = async (req, res) => {
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

        // Lägg till id och userId sist i values-arrayen
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

exports.deleteBooking = async (req, res) => {
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
