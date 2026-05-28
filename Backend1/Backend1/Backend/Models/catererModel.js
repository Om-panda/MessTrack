const { pool } = require('../config/db');

async function createCaterer(name, reg_no, password, hostel_block) {
    await pool.query(
        `INSERT INTO students (name, reg_no, password, role, hostel_block)
         VALUES (?, ?, ?, 'caterer', ?)`,
        [name, reg_no, password, hostel_block]
    );
}

async function deleteCatererByRegNo(reg_no) {
    await pool.query(
        "DELETE FROM students WHERE reg_no = ? AND role = 'caterer'",
        [reg_no]
    );
}

module.exports = { createCaterer, deleteCatererByRegNo };