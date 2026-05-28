const { pool } = require('../config/db');

async function getDashboardSummary(month, year) {
    const [rows] = await pool.query(`
        SELECT 
            a.meal_type,
            COUNT(*) as count,
            p.price,
            COUNT(*) * p.price as revenue
        FROM attendance a
        JOIN (
            SELECT meal_type, price
            FROM pricing
            WHERE id IN (
                SELECT MAX(id) FROM pricing GROUP BY meal_type
            )
        ) p ON a.meal_type = p.meal_type
        WHERE MONTH(a.date) = ? AND YEAR(a.date) = ?
        GROUP BY a.meal_type
    `, [month, year]);

    return rows;
}
module.exports = { getDashboardSummary };