const db = require('../db');

exports.getStats = async (req, res) => {
    try {
        const [[{ total_users }]] = await db.query(`SELECT COUNT(*) AS total_users FROM users`);
        const [[{ total_dogs }]] = await db.query(`SELECT COUNT(*) AS total_dogs FROM dogs`);
        const [[{ total_bookings }]] = await db.query(`SELECT COUNT(*) AS total_bookings FROM bookings`);
        const [[{ today_bookings }]] = await db.query(`
            SELECT COUNT(*) AS today_bookings
            FROM bookings
            WHERE date = CURDATE()
        `);

        res.json({
            total_users,
            total_dogs,
            total_bookings,
            today_bookings
        });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err });
    }
};
