const db = require('../db');

// GET – alla hundar med bokning idag
exports.getTodayAttendance = (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // yyyy-MM-DD

        const sql = `
            SELECT
                b.id AS bookingId,
                b.date,
                b.type,
                b.status,
                b.checkin_time,
                b.checkout_time,
                d.name AS dogName,
                d.id AS dogId,
                u.name AS ownerName
            FROM bookings b
            JOIN dogs d ON b.dog_id = d.id
            JOIN users u ON d.owner_id = u.id
            WHERE b.date = ?
            ORDER BY d.name ASC
        `;

        db.query(sql, [today], (err, results) => {
            if (err) return res.status(500).json({ message: "Database error", error: err.message });
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// POST – checka in hund
exports.checkIn = (req, res) => {
    const { bookingId } = req.params;

    const sql = `
        UPDATE bookings
        SET status = 'checked_in', checkin_time = NOW()
        WHERE id = ?;
    `;

    db.query(sql, [bookingId], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Booking not found" });

        res.json({ message: "Hund incheckad!" });
    });
};

// POST – checka ut hund
exports.checkOut = (req, res) => {
    const { bookingId } = req.params;

    const sql = `
        UPDATE bookings
        SET status = 'checked_out', checkout_time = NOW()
        WHERE id = ?;
    `;

    db.query(sql, [bookingId], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Booking not found" });

        res.json({ message: "Hund utcheckad!" });
    });
};
