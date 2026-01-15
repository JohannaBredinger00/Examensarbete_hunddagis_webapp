const db = require('../db');

// GET /api/dogs/mydogs - Hämtar användarens hundar 
exports.getMyDogs = async (req, res) => {
  try {
    const userId = req.userId;

    const [results] = await db.execute(`
      SELECT d.* 
      FROM dogs d 
      JOIN owners o ON d.owner_id = o.id
      WHERE o.user_id = ?
    `, [userId]);

    console.log('Found dogs:', results.length);
    res.json(results);

  } catch (error) {
    console.error('Error in getMyDogs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// POST /api/dogs/add - Lägg till ny hund
exports.addDog = async (req, res) => {
  console.log('REQ BODY:', req.body);
  console.log('REQ FILE:', req.file);
  try {
    const { name, breed, age, allergies } = req.body;
    const userId = req.userId;

    if (!name) return res.status(400).json({ message: 'Hundens namn krävs' });

    // Hämta owner_id
    const [ownerResults] = await db.execute(
      'SELECT id FROM owners WHERE user_id = ?',
      [userId]
    );

    if (ownerResults.length === 0) return res.status(404).json({ message: 'Ingen ägare hittades' });

    const image = req.file ? req.file.filename : null;

    const [insertResult] = await db.execute(
      'INSERT INTO dogs (owner_id, name, breed, age, allergies, image) VALUES (?, ?, ?, ?, ?, ?)',
      [ownerResults[0].id, name, breed || null, age || null, allergies || null, image || null]
    )

    res.status(201).json({ 
      message: 'Hund tillagd', 
      dogId: insertResult.insertId 
    });

  } catch (error) {
    console.error('Error in addDog:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// PUT - uppdatera hund 
exports.updateDog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { name, breed, age, allergies } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Hundens namn krävs' });
    }
    let image;
      if(req.file) {
        image = req.file.filename;
      }

      const ageValue = age ? parseInt (age) : null;

      let sql = `UPDATE dogs d
                  JOIN owners o ON d.owner_id = o.id
                  SET d.name = ?, d.breed = ?, d.age = ?, d.allergies = ?`;
      const params = [name, breed || null, age || null, allergies || null];

      if (image) {
        sql += `, d.image = ? `; 
        params.push(image);
      }

      sql += ` WHERE d.id = ? AND o.user_id = ?`;
      params.push(id, userId);

      const [result] = await db.execute(sql, params);

      if (result.affectedRows === 0) {
        return res.status(400).json({message: 'Hund ej hittad'});
      }
/*
    const [result] = await db.execute(
      `UPDATE dogs d
      JOIN owners o ON d.owner_id = o.id
      SET d.name = ?, d.breed = ?, d.age = ?, d.allergies = ?
      WHERE d.id = ? AND o.user_id = ?`,
      [name, breed || null, age || null, allergies || null, id, userId]
    );
        if (result.affectedRows === 0) {
          return res.status(400).json({ message: 'Hund ej hittad' });
        }
          */

        // Hämta den uppdaterade hunden
        const [updatedRows] = await db.execute(
          `SELECT d.id, d.name, d.breed, d.age, d.allergies, d.image, o.id AS ownerId
          FROM dogs d
          JOIN owners o ON d.owner_id = o.id
          WHERE d.id = ?`,
        [id]
      );
      const updateDog = updatedRows[0];

        res.json({ message: 'Hund uppdaterad',
          dog: updateDog 
          /*{ id, name, breed, age, allergies }*/
         });
      } catch (error) {
        console.error('Error in updateDog', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
};

// DELETE /api/dogs/:id - Ta bort hund
exports.deleteDog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    console.log(`DELETE dog id=${id}, userId=${userId}`);

    const [result] = await db.execute(
      `DELETE d FROM dogs d
      JOIN owners o ON d.owner_id = o.id
      WHERE d.id = ? AND o.user_id = ?`,
      [id, userId]
    );

    console.log("DB result:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Hund ej hittad"});
    }

    return res.json({ message: "Hund borttagen"});

  } catch (error) {
    console.log("Error deleting dog:", error);
    return res.status(500).json({ message: "Server error", error: error.message});
  }
};

  

exports.getAllDogs = async (req, res) => {
  try {
    //const dogs = await dogs.findAll();
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};