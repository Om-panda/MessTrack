const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

async function registerDevice(req, res) {

    try {

        const { device_id, hostel_block } = req.body;

        if (!device_id || !hostel_block) {
            return res.status(400).json({
                message: 'All fields required'
            });
        }

        
        const [existing] = await pool.query(
            `SELECT * FROM devices WHERE device_id = ?`,
            [device_id]
        );

        if (existing.length > 0) {

            return res.json({
                message: 'Device already registered',
                device_id: existing[0].device_id,
                hostel_block: existing[0].hostel_block,
                device_token: existing[0].device_token
            });
        }

        
        const device_token = uuidv4();

        await pool.query(
            `INSERT INTO devices
            (device_id, hostel_block, device_token)
            VALUES (?, ?, ?)`,
            [device_id, hostel_block, device_token]
        );

        res.json({
            message: 'Device registered successfully',
            device_id,
            hostel_block,
            device_token
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
}

module.exports = { registerDevice };