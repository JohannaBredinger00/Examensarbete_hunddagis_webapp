const express = require('express');
//const bodyParser = require('body-parser');
const cors = require('cors');
const dogsRoute = require('./routes/dogs');
const bookingsRoute = require('./routes/bookings');
const ownersRoute = require('./routes/owners');
const attendanceRoutes = require('./routes/attendance');
//const usersRoute = require('./routes/users');
require('dotenv').config();
const adminBookingsRoute = require('./routes/adminBookings');
const adminDogsRoute = require('./routes/adminDogs');
const path = require('path');

const db = require('./db'); 
const app = express();

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url, "Authorization:", req.headers.authorization || "None");
  next();
});
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
   exposedHeaders: ['Content-Type'],
};



app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // frontend URL
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});



app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
//const usersRoute = require('./routes/users');
app.use('/api/users', require('./routes/users'));
app.use('/api/dogs', require('./routes/dogs'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/owners', require('./routes/owners'));
app.use('/api/attendance', require('./routes/attendance'));



app.use('/api/admin/bookings', adminBookingsRoute);
app.use('/api/admin/dogs', adminDogsRoute);
//app.use('/api/admin/attendance', attendanceRoute); 



const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    try{
        const [rows] = await db.query("SHOW COLUMNS FROM bookings");
        console.log("columns in bookings table:");
        console.log(rows);

    } catch (err) {
        console.error("error loading columns:" ,err);
    }
});

