const { pool } = require('../config/db');
const { getAllPrices } = require('../Models/billingModel');
const { getStudentsByHostel } = require('../Models/studentModel');
const { createCaterer, deleteCatererByRegNo } = require('../Models/catererModel');
const bcrypt = require('bcrypt');

async function getTodayMeals(req, res) {
    try {
        const caterer_id = req.user.id;

        const [caterer] = await pool.query(
            'SELECT hostel_block FROM students WHERE id = ?',
            [caterer_id]
        );

        const hostel = caterer[0].hostel_block;

        const today = new Date().toISOString().split(' ')[0];

        const [rows] = await pool.query(
            `SELECT a.meal_type, COUNT(*) as count
             FROM attendance a
             JOIN students s ON a.student_id = s.id
             WHERE a.date = ?
             AND s.hostel_block = ?
             GROUP BY a.meal_type`,
            [today, hostel]
        );

        return res.json({
            date: today,
            meals: rows
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

async function getMonthlyReport(req, res) {
    try {
        const { month, year } = req.body;

        if (!month || !year) {
            return res.status(400).json({ message: "Month and year required" });
        }

        const [caterer] = await pool.query(
            'SELECT hostel_block FROM students WHERE id = ? AND role = "caterer"',
            [req.user.id]
        );

        if (!caterer.length) {
            return res.status(403).json({ message: "Caterer not found" });
        }

        const hostel = caterer[0].hostel_block;

        const [rows] = await pool.query(
            `SELECT a.meal_type, COUNT(*) as count
             FROM attendance a
             JOIN students s ON a.student_id = s.id
             WHERE MONTH(a.date) = ?
             AND YEAR(a.date) = ?
             AND s.hostel_block = ?
             GROUP BY a.meal_type`,
            [month, year, hostel]
        );

        const prices = await getAllPrices();

        const priceMap = {};
        prices.forEach(p => {
            priceMap[p.meal_type] = p.price;
        });

        let total = 0;

        const detailed = rows.map(r => {
            const price = priceMap[r.meal_type] || 0;
            const subtotal = price * r.count;
            total += subtotal;

            return {
                meal_type: r.meal_type,
                count: r.count,
                price,
                subtotal
            };
        });

        return res.json({
            month,
            year,
            meals: detailed,
            total_payment: total
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


async function getCatererStudentsController(req, res) {
  try {
    const caterer_id = req.user.id;

    const [rows] = await pool.query(
      `SELECT hostel_block FROM students WHERE id = ? AND role = 'caterer'`,
      [caterer_id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Caterer not found" });
    }

    const hostel = rows[0].hostel_block;

    const students = await getStudentsByHostel(hostel);

    const [attendance] = await pool.query(
      `SELECT student_id, meal_type 
       FROM attendance 
       WHERE date = CURDATE()`
    );

    const [blocks] = await pool.query(
      `SELECT student_id 
       FROM meal_block 
       WHERE CURDATE() BETWEEN start_date AND end_date`
    );

    const attendanceMap = {};
    attendance.forEach(a => {
      if (!attendanceMap[a.student_id]) {
        attendanceMap[a.student_id] = {};
      }
      attendanceMap[a.student_id][a.meal_type] = true;
    });

    const blockedSet = new Set(blocks.map(b => b.student_id));

    const finalStudents = students.map(s => ({
      ...s,
      blocked: blockedSet.has(s.id),
      meals: attendanceMap[s.id] || {}
    }));

    res.json(finalStudents);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function addCaterer(req, res) {
    try {
        const { name, reg_no, password, hostel_block } = req.body;

        if (!name || !reg_no || !password || !hostel_block) {
            return res.status(400).json({
                message: "All fields (name, reg_no, password, hostel_block) are required"
            });
        }

        const [existing] = await pool.query(
            'SELECT id FROM students WHERE reg_no = ?',
            [reg_no]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "Caterer already exists"
            });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        try {
            await createCaterer(name, reg_no, hashedpassword, hostel_block);
        } catch (err) {

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    message: "Duplicate entry error"
                });
            }

            throw err;
        }

        return res.json({
            message: 'Caterer added successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function deleteCaterer(req, res) {
    try {
        const { reg_no } = req.body;

        if (!reg_no) {
            return res.status(400).json({
                message: "Reg_no is required"
            });
        }

        const [existing] = await pool.query(
            "SELECT id FROM students WHERE reg_no = ? AND role = 'caterer'",
            [reg_no]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                message: "Caterer not found"
            });
        }

        await deleteCatererByRegNo(reg_no);

        return res.json({
            message: "Caterer deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { getTodayMeals, getMonthlyReport, getCatererStudentsController, addCaterer, deleteCaterer };