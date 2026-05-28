const { pool } = require('../config/db');
async function uploadAttendance(req, res) {
    try {

        const logs = req.body;

        if (!Array.isArray(logs)) {

            return res.status(400).json({ message: 'Invalid attendance data' });
        }

        let inserted = 0;

        for (const log of logs) {

            const { reg_no, meal_type, date } = log;

            const [students] = await pool.query(

                `SELECT id
                 FROM students
                 WHERE reg_no = ?`,

                [reg_no]
            );

            if (students.length === 0) {

                continue;
            }

            const student_id = students[0].id;

            const [existing] = await pool.query(

                `SELECT id
                 FROM attendance
                 WHERE student_id = ?
                 AND meal_type = ?
                 AND date = ?`,

                [ student_id, meal_type, date ]
            );

            if (existing.length > 0) {

                continue;
            }

            await pool.query(

                `INSERT INTO attendance
                (
                    student_id,
                    meal_type,
                    date
                )
                VALUES (?, ?, ?)`,

                [ student_id, meal_type, date ]
            );

            inserted++;
        }

        res.json({ message: 'Attendance uploaded', inserted });

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { uploadAttendance };