const db = require('../db'); // db ska exportera en mysql2/promise pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register ny användare
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Kolla om email redan finns
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hasha lösenord
        const hashedPassword = await bcrypt.hash(password, 10);

        // Lägg till användare
        const [userResult] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'customer']
        );

        // Skapa automatiskt owner-profil
        if (!role || role === 'customer') {
            await db.query('INSERT INTO owners (user_id) VALUES (?)', [userResult.insertId]);
        }

        res.status(201).json({ message: 'User registered successfully', userId: userResult.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: 'Wrong email or password' });

        const user = users[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Wrong email or password' });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
