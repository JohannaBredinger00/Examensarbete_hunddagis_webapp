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

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [ 'Content-Type', 'Authorization' ],
    credentials: true
}));
/*
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});
*/


//app.options('*', cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.json());


// Routes
//const usersRoute = require('./routes/users');
app.use('/api/users', require('./routes/users'));
app.use('/api/dogs', require('./routes/dogs'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/owners', require('./routes/owners'));
app.use('/api/attendance', require('./routes/attendance'));

/*
app.use('/api/admin/bookings', require('./routes/adminBookings'));
app.use('/api/admin/dogs', require('./routes/adminDogs'));
app.use('/api/admin/users', require ('./routes/adminUsers'));
app.use('/api/admin/stats', require ('./routes/adminStats'));
app.use('/admin/attendance', require('./routes/attendance'));
*/

app.use('/api/admin/bookings', adminBookingsRoute);
app.use('/api/admin/dogs', adminDogsRoute);
//app.use('/api/admin/attendance', attendanceRoute); 



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
