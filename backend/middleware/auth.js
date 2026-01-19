const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    //console.log("AUTH middleware hit. Method:", req.method);

    //Always allow preflight requests
    if (req.method === "OPTIONS") {
        return next();
    }

    //Read Authorization header (case-insensitive)
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header' });
    }

    
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({ message: 'Malformed token' });
    }

    try {
        //Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log("AUTH middlewear decoded:", decoded);

        //Attach user info to request
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        console.log("JWT ERROR:", error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = auth;
