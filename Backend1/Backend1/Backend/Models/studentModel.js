const { pool } = require('../config/db');

async function findStudentByRegno(reg_no){
    const [rows] = await pool.query('SELECT * FROM students WHERE reg_no = ?', [reg_no]);
    return rows[0];
}

async function createStudent(name, reg_no, password, hostel_block, rfid_uid) {
    await pool.query(
        `INSERT INTO students (name, reg_no, password, role, hostel_block, rfid_uid)
         VALUES (?, ?, ?, 'student', ?, ?)`,
        [name, reg_no, password, hostel_block, rfid_uid]
    );
}

async function updateStudent(id, name, reg_no) {
    const [result] = await pool.query('UPDATE students  SET name = ?, reg_no = ? WHERE id = ?',[name, reg_no, id]);
    return result;
}

async function deleteStudentByRegNo(reg_no) {
    const [result] = await pool.query(
        'DELETE FROM students WHERE reg_no = ?',
        [reg_no]
    );
    return result;
}

// 🔥 GET STUDENTS BY HOSTEL
async function getStudentsByHostel(hostel) {
    const [rows] = await pool.query(
        `SELECT id, name, reg_no, hostel_block 
         FROM students 
         WHERE hostel_block = ? AND role = 'student'`,
        [hostel]
    );
    return rows;
}


async function getCaterers() {

    const [rows] = await pool.query(

        `SELECT
            id,
            name,
            reg_no,
            hostel_block
         FROM students
         WHERE role = 'caterer'`
    );

    return rows;
}

module.exports = { findStudentByRegno, createStudent, updateStudent, deleteStudentByRegNo, getStudentsByHostel, getCaterers };