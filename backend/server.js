const express = require('express');
//const bodyParser = require('body-parser');
const cors = require('cors');
const dogsRoute = require('./routes/dogs');
const bookingsRoute = require('./routes/bookings');
const ownersRoute = require('./routes/owners');
const attendanceRoute = require('./routes/attendance');
//const usersRoute = require('./routes/users');
require('dotenv').config();
const adminBookingsRoute = require('./routes/adminBookings');
const adminDogsRoute = require('./routes/adminDogs');


const db = require('./db'); 
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
   exposedHeaders: ['Content-Type'],
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
