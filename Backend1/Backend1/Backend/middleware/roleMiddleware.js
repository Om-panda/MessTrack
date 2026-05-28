const { pool } = require('../config/db');

function roleMiddleware(requiredRole) {
    return (req, res, next) => {
        try {
            const userRole = req.user.role;

            if (!userRole) {
                return res.status(403).json({ message: "Role missing" });
            }

            if (userRole.toLowerCase() !== requiredRole.toLowerCase()) {
                return res.status(403).json({ message: "Access denied" });
            }

            next();

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    };
}

module.exports = roleMiddleware;