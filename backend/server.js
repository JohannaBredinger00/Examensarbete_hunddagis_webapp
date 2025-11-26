const express = require('express');
//const bodyParser = require('body-parser');
const cors = require('cors');
const dogsRoute = require('./routes/dogs');
const bookingsRoute = require('./routes/bookings');
const ownersRoute = require('./routes/owners');
const attendanceRoute = require('./routes/attendance');
//const usersRoute = require('./routes/users');
require('dotenv').config();


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
const usersRoute = require('./routes/users');
app.use('/api/users', usersRoute);
app.use('/api/dogs', dogsRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/owners', ownersRoute);
app.use('/api/attendance', attendanceRoute);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
