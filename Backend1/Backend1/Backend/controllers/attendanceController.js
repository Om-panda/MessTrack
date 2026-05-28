const { isBlocked } = require('../Models/blockModel');
const { pool } = require('../config/db');

function getCurrentMealSession() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    if (minutes >= 7 * 60 && minutes <= 9 * 60 + 15) return 'breakfast';
    if (minutes >= 12 * 60 + 30 && minutes <= 14 * 60 + 30) return 'lunch';
    if (minutes >= 17 * 60 && minutes <= 19 * 60) return 'snacks';
    if (minutes >= 20 * 60 + 30 && minutes <= 22 * 60) return 'dinner';

    return null;
}

async function markAttendanceController(req, res) {
    try {
        const { rfid_uid } = req.body;

        if (!rfid_uid) {
            return res.status(400).json({ message: 'RFID required' });
        }

        const today = new Date().toISOString().split('T')[0];

        const meal_type = getCurrentMealSession();
        if (!meal_type) {
            return res.status(400).json({
                message: 'Not within meal time'
            });
        }

        const [students] = await pool.query(
            'SELECT id, name, reg_no FROM students WHERE rfid_uid = ? AND role = "student"',
            [rfid_uid]
        );

        const student = students[0];

        if (!student) {
            return res.status(404).json({ message: 'Invalid RFID' });
        }

        const student_id = student.id;

        const blocked = await isBlocked(student_id, today, meal_type);
        if (blocked) {
            return res.status(403).json({
                message: `Meal is blocked for ${meal_type}`
            });
        }

        try {
            await pool.query(
                `INSERT INTO attendance (student_id, meal_type, date)
                 VALUES (?, ?, ?)`,
                [student_id, meal_type, today]
            );
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    message: 'Meal already taken'
                });
            }
            throw err;
        }

        return res.json({
            message: `${meal_type} marked successfully`,
            student
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { markAttendanceController };