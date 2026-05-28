const { pool } = require('../config/db');

async function getDashboardData(hostel_block) {
    const today = new Date().toISOString().split('T')[0];

    const [rows] = await pool.query(`
    SELECT 
        s.id,
        s.name,
        s.reg_no,

        -- Meal status today
        MAX(CASE WHEN a.meal_type = 'breakfast' THEN 1 ELSE 0 END) as breakfast,
        MAX(CASE WHEN a.meal_type = 'lunch' THEN 1 ELSE 0 END) as lunch,
        MAX(CASE WHEN a.meal_type = 'snacks' THEN 1 ELSE 0 END) as snacks,
        MAX(CASE WHEN a.meal_type = 'dinner' THEN 1 ELSE 0 END) as dinner,

        -- Block status
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM meal_block mb
                WHERE mb.student_id = s.id
                AND CURDATE() BETWEEN mb.start_date AND mb.end_date
            ) THEN 'Blocked'
            ELSE 'Active'
        END as card_status

    FROM students s

    LEFT JOIN attendance a 
        ON a.student_id = s.id 
        AND a.date = CURDATE()

    WHERE s.hostel_block = ?
    AND s.role = 'student'

    GROUP BY s.id
`);

    return rows;
}

module.exports = { getDashboardData };