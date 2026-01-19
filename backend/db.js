const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.query("SELECT DATABASE()").then(([rows]) => {
});


module.exports = db;