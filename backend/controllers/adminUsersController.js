const db = require('../db');

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT id, name, email, phone, address, role
            FROM users
        `);

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const [user] = await db.query(`
            SELECT id, name, email, phone, address, role
            FROM users
            WHERE id = ?
        `, [req.params.id]);

        if (user.length === 0)
            return res.status(404).json({ error: "User not found" });

        res.json(user[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err });
    }
};
