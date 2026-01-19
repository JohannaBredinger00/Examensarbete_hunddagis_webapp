const db = require('../db');

// GET /api/owners/myprofile - Hämta användarens ägarprofil
exports.getMyProfile = async (req, res) => {
    try {
        const userId = req.userId;
        
        const [profile] = await db.execute(`
            SELECT u.name, u.email, u.created_at, o.phone, o.address 
            FROM users u
            LEFT JOIN owners o ON u.id = o.user_id
            WHERE u.id = ?
        `, [userId]);

        if (profile.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PUT /api/owners/myprofile - Uppdatera ägarprofil
exports.updateMyProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { phone, address } = req.body;

        // Kolla om ägare redan finns
        const [existingOwner] = await db.execute(
            'SELECT id FROM owners WHERE user_id = ?',
            [userId]
        );

        if (existingOwner.length > 0) {
            // Uppdatera befintlig ägare
            const [result] = await db.execute(
                'UPDATE owners SET phone = ?, address = ? WHERE user_id = ?',
                [phone, address, userId]
            );
            res.json({ message: 'Profile updated' });
        } else {
            // Skapa ny ägare
            const [result] = await db.execute(
                'INSERT INTO owners (user_id, phone, address) VALUES (?, ?, ?)',
                [userId, phone, address]
            );
            res.json({ message: 'Profile created' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/owners/all - Hämta alla ägare (ADMIN)
exports.getAllOwners = async (req, res) => {
    try {
        const [owners] = await db.execute(`
            SELECT u.id, u.name, u.email, u.created_at, o.phone, o.address,
                   COUNT(d.id) as dog_count
            FROM users u
            LEFT JOIN owners o ON u.id = o.user_id
            LEFT JOIN dogs d ON o.id = d.owner_id
            WHERE u.role = 'customer'
            GROUP BY u.id
        `);

        res.json(owners);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};