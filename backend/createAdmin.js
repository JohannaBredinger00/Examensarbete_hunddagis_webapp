const bcrypt = require('bcryptjs');

async function createHash() {
    const password = 'Admin123!'; // Sätt det nya lösenordet här
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('Hash för admin:', hash);
}

createHash();
