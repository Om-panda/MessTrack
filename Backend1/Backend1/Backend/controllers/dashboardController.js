const { pool } = require('../config/db');

async function dashboardController(req, res) {
    try {
        const [caterer] = await pool.query(
    'SELECT hostel_block FROM students WHERE id = ? AND role = "caterer"',
    [req.user.id]
);

if (!caterer.length) {
    return res.status(403).json({ message: "Caterer not found" });
}

const hostel_block = caterer[0].hostel_block;

        const [students] = await pool.query(`
            SELECT 
                s.id,
                s.name,
                s.reg_no,

                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM meal_block mb
                        WHERE mb.student_id = s.id
                        AND CURDATE() BETWEEN mb.start_date AND mb.end_date
                    ) THEN 'Blocked'
                    ELSE 'Active'
                END as card_status

            FROM students s
            WHERE s.hostel_block = ?
            AND s.role = 'student'
        `, [hostel_block]);

        const total = students.length;

        const active = students.filter(s => s.card_status === 'Active').length;
        const blocked = students.filter(s => s.card_status === 'Blocked').length;

        return res.json({
            total_students: total,
            active_students: active,
            blocked_students: blocked,
            students
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = { dashboardController };