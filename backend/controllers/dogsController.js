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
  console.log("BODY I BACKEND:", req.body);
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

    const [insertResult] = await db.execute(
      'INSERT INTO dogs (owner_id, name, breed, age, allergies) VALUES (?, ?, ?, ?, ?)',
      [ownerResults[0].id, name, breed || null, age || null, allergies || null]
    );

    console.log('Dog inserted with ID:', insertResult.insertId);

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
    

    db.execute(
      `UPDATE dogs d
      JOIN owners o ON d.owner_id = o.id
      SET d.name = ?, d.breed = ?, d.age = ?, d.allergies = ?
      WHERE d.id = ? AND o.user_id = ?`,
      [name, breed || null, age || null, allergies || null, id, userId],
      (err, result) => {
        if (err) {
          console.error('Error updating dog:', err);
          return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (result.affectedRows === 0) {
          return res.status(400).json({ message: 'Hund ej hittad' });
        }

        res.json({ message: 'Hund uppdaterad' });
      }
    );
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