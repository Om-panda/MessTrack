const bcrypt = require('bcrypt');
const {createStudent} = require('../Models/studentModel');
const { pool } = require('../config/db');


async function addStudent(req, res) {
    try {
        
        const { name, reg_no, password, hostel_block, rfid_uid } = req.body;

        if (!name || !reg_no || !password || !hostel_block || !rfid_uid) {
            return res.status(400).json({
                message: "All fields (name, reg_no, password, hostel_block, rfid_uid) are required"
            });
        }
        const [existing] = await pool.query(
            'SELECT id FROM students WHERE rfid_uid = ?',
            [rfid_uid]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "RFID already exists"
            });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

       try {
            await createStudent(name, reg_no, hashedpassword, hostel_block, rfid_uid);
        } catch (err) {

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    message: "RFID already assigned to another student"
                });
            }

            throw err;
        }

        return res.json({
            message: 'Student added successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function studentReportSelfController(req, res) {
    try {
        const { month, year } = req.body;
        const student_id = req.user.id;

        if (!month || !year) {
            return res.status(400).json({ message: "Month and year required" });
        }

        const [meals] = await pool.query(
            `SELECT meal_type, COUNT(*) as count
             FROM attendance
             WHERE student_id = ?
             AND MONTH(date) = ?
             AND YEAR(date) = ?
             GROUP BY meal_type`,
            [student_id, month, year]
        );

        const [blocks] = await pool.query(
            `SELECT meal_type, start_date, end_date
             FROM meal_block
             WHERE student_id = ?
             AND (
                MONTH(start_date) = ? OR MONTH(end_date) = ?
             )
             AND (
                YEAR(start_date) = ? OR YEAR(end_date) = ?
             )`,
            [student_id, month, month, year, year]
        );

        return res.json({
            month,
            year,
            consumed_meals: meals,
            blocked_meals: blocks
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = {addStudent, studentReportSelfController};