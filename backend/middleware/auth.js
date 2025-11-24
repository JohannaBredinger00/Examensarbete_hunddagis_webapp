const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    console.log("AUTH middlewear hit. Headers:", req.headers);

    const authHeader = req.headers['authorization']; // lowercase
    const token = authHeader && authHeader.replace('Bearer ', '');


    //const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("Extracted token:", token);


    if (!token) {
        return res.status(401).json({ message: 'No token, access denied'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
/*
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };
        */

        req.userId = decoded.userId;
        req.userRole = decoded.role;
        
        next();
    } catch (error) {
        console.log("JWT ERROR:", error);
        res.status(401).json({ message: 'Invalid token'});
    }
};

module.exports = auth;