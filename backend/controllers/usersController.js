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

// GET myprofile
exports.getMyProfile = async (req, res) => {
    try {
        const userId = req.userId;

        //Hämta user
        const [user] = await db.query(
            `SELECT u.id, u.name, u.email, u.role, o.phone, o.address
             FROM users u
             LEFT JOIN owners o ON o.user_id = u.id
             WHERE u.id = ?`,
            [userId]
        );

        if (!user[0]) return res.status(404).json({ message: "User not found" });
        
        res.json(user[0]);
    } catch (error) {
        console.error("Error in getMyProfile:", error);
        res.status(500).json({ message: 'Failed to load profile' });
    }
};


// PUT /users/myprofile
exports.updateMyProfile = async (req, res) => {
    const { name, email, phone } = req.body;
    const userId = req.userId;

    try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'E-postadressen används redan av en annan användare '});
        }
        // Uppdatera users 
        await db.query(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, userId]
        );

        //Uppdatera owners-tabellen (telefon)
        await db.query(
            'UPDATE owners SET phone = ? WHERE user_id = ?',
            [phone || null, userId]
        );
    
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
            console.error('Error in updateMyProfile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};
