const { pool } = require('../config/db');

async function checkAttendance(student_id, meal_type, date) {
    const [rows] = await pool.query(
        `SELECT * FROM attendance WHERE student_id = ? AND meal_type = ? AND date = ?`,[student_id, meal_type, date]
    );
    return rows[0];
}

async function markAttendance(student_id, meal_type, date) {
    const [result] = await pool.query(
        `INSERT INTO attendance (student_id, meal_type, date) VALUES (?, ?, ?)`,[student_id, meal_type, date]
    );
    return result;
}

module.exports = {checkAttendance,markAttendance};