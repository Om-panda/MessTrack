const { pool } = require('../config/db');


async function deviceAuth(req, res, next) {

    try {

        
        const device_id = req.headers['device-id'];
        const device_token = req.headers['device-token'];

        if (!device_id || !device_token) {

            return res.status(401).json({
                message: 'Device authentication required'
            });
        }

        const [rows] = await pool.query(
            `SELECT * FROM devices
             WHERE device_id = ?
             AND device_token = ?`,
            [device_id, device_token]
        );

        if (rows.length === 0) {

            return res.status(403).json({
                message: 'Invalid device credentials'
            });
        }

        req.device = rows[0];

        next();

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
}

module.exports = deviceAuth;