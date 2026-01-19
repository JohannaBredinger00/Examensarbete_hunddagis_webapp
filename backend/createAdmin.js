const bcrypt = require('bcryptjs');

async function createHash() {
    const password = 'test123'; 
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('Hash för johanna@jb.com:', hash);
}

createHash();
