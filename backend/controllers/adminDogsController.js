const db = require('../db');

exports.getAllDogs = async (req, res) => {
  try {
    const [dogs] = await db.execute(`
      SELECT d.id, d.name, d.breed, d.age, d.allergies,
      u.name AS ownerName, u.email AS ownerEmail, o.phone AS ownerPhone
            FROM dogs d
            JOIN users o ON d.owner_id = o.id
            JOIN users u ON  o.user_id = u.id
            ORDER BY d.name ASC
    `);
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};

exports.getDogById = async (req, res) => {
    try {
        const [result] = await db.execute(`
            SELECT d.id, d.name, d.breed, d.age, d.allergies,
            u.name AS ownerName, u.email AS ownerEmail, o.phone AS ownerPhone,
            FROM dogs d
            JOIN users o ON d.owner_id = o.id
            JOIN users u ON o.user_id = u.id
            WHERE d.id = ?
        `, [id]);

        if (result.length === 0)
            return res.status(404).json({ error: "Dog not found" });

        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err });
    }
};
