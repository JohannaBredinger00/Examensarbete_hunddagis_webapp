const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
require('dotenv').config();


console.log("Connecting to database with config:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.query("SELECT DATABASE()").then(([rows]) => {
    console.log("Connected to DB:", rows[0]["DATABASE()"]);
});


module.exports = db;