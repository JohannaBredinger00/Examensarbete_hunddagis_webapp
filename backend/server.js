const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dogsRoute = require('./routes/dogs');
const bookingsRoute = require('./routes/bookings');
const ownersRoute = require('./routes/owners');
require('dotenv').config();

const db = require('./db'); 

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());


// Routes
const usersRoute = require('./routes/users');
app.use('/api/users', usersRoute);
app.use('/api/dogs', dogsRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/owners', ownersRoute);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
