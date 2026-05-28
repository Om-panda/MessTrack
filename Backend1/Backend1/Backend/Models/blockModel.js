const { pool } = require('../config/db');

async function createBlock(student_id, start_date, end_date, meal_types) {
    const values = meal_types.map(meal => [
        student_id,
        start_date,
        end_date,
        meal
    ]);

    await pool.query(
        `INSERT INTO meal_block (student_id, start_date, end_date, meal_type)
         VALUES ?`,
        [values]
    );
}

async function isBlocked(student_id, date, meal_type) {
    const [rows] = await pool.query(
        `SELECT 1 FROM meal_block
         WHERE student_id = ?
         AND meal_type = ?
         AND ? BETWEEN start_date AND end_date
         LIMIT 1`,
        [student_id, meal_type, date]
    );

    return rows.length > 0;
}

module.exports = { createBlock, isBlocked };