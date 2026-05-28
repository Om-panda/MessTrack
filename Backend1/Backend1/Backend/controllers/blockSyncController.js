const { pool } = require('../config/db');

async function syncBlockedMeals(req, res) {

    try {

        const hostel_block = req.device.hostel_block;

        const [rows] = await pool.query(
            `SELECT
                s.reg_no,
                mb.meal_type,
                mb.end_date
            FROM meal_block mb
            JOIN students s
            ON mb.student_id = s.id
            WHERE s.hostel_block = ?
            AND mb.end_date >= CURDATE()`,
            [hostel_block]
        );

        res.json({ hostel_block, total_blocks: rows.length, blocked_meals: rows });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
}

module.exports = { syncBlockedMeals };