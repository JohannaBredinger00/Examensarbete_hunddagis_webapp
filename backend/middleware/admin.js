module.exports = (req, res, next) => {
    if (!req.userRole) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
};
