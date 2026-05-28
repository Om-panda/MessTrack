const { pool } = require('../config/db');


async function syncStudents(req, res) {

    try {

        const hostel_block = req.device.hostel_block;

        const [rows] = await pool.query(
            `SELECT reg_no
             FROM students
             WHERE hostel_block = ?
             AND role = 'student'`,
            [hostel_block]
        );

        res.json({ hostel_block, total_students: rows.length, students: rows });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
}
module.exports = { syncStudents };