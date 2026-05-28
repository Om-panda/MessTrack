const { pool } = require('../config/db');

async function getStudentMealSummary(student_id, month, year) {
    const [rows] = await pool.query(
        `SELECT meal_type, COUNT(*) as count
         FROM attendance
         WHERE student_id = ?
         AND MONTH(date) = ?
         AND YEAR(date) = ?
         GROUP BY meal_type`,
        [student_id, month, year]
    );
    return rows;
}

async function getAllPrices() {
    const [rows] = await pool.query(`
        SELECT meal_type, price FROM pricing 
        WHERE id IN (
            SELECT MAX(id) FROM pricing GROUP BY meal_type
        )
    `);
    return rows;
}

async function getStudentFullReport(student_id, month, year) {
    const [rows] = await pool.query( `SELECT meal_type, COUNT(*) as count FROM attendance WHERE 
        student_id = ? AND MONTH(date) = ? AND YEAR(date) = ? GROUP BY meal_type`, [student_id, month, year] );
    return rows;
}

async function getStudentBillWithHistory(student_id, month, year) {
    const [rows] = await pool.query(`
        SELECT 
            a.meal_type,
            COUNT(*) as count,
            p.price,
            COUNT(*) * p.price as subtotal

        FROM attendance a

        JOIN pricing p 
        ON p.meal_type = a.meal_type
        AND p.effective_from = (
            SELECT MAX(p2.effective_from)
            FROM pricing p2
            WHERE p2.meal_type = a.meal_type
            AND p2.effective_from <= a.date
        )

        WHERE a.student_id = ?
        AND MONTH(a.date) = ?
        AND YEAR(a.date) = ?

        GROUP BY a.meal_type, p.price
    `, [student_id, month, year]);

    return rows;
}

module.exports = { getAllPrices, getStudentFullReport, getStudentMealSummary, getStudentBillWithHistory };