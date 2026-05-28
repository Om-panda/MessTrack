const { getDashboardSummary } = require('../Models/adminModel');
const { findStudentByRegno } = require('../Models/studentModel');
const { updateStudent } = require('../Models/studentModel');
const { deleteStudentByRegNo } = require('../Models/studentModel');
const { getStudentsByHostel, getCaterers } = require('../Models/studentModel');
const { pool } = require('../config/db'); 
const { getStudentBillWithHistory } = require('../Models/billingModel');


async function studentReportController(req, res) {
    try {
        const { reg_no, month, year } = req.body;
        if (!reg_no || !month || !year) {
            return res.status(400).json({ message: "All fields required" });
        }
        const student = await findStudentByRegno(reg_no);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        const student_id = student.id;
        const rows = await getStudentBillWithHistory(student.id, month, year);

        let total = 0;

        const detailedMeals = rows.map(r => {
            total += r.subtotal;

            return {
                meal_type: r.meal_type,
                count: r.count,
                price: r.price,
                subtotal: r.subtotal
            };
        });
        const { password, ...safeStudent } = student;
        return res.json({
            student: safeStudent,
            month,
            year,
            meals: detailedMeals,
            total_amount: total
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function updateStudentController(req, res) {
    try {
        const { id, name, reg_no } = req.body;

        if (!id || !name || !reg_no) {
            return res.status(400).json({ message: "All fields required" });
        }

        await updateStudent(id, name, reg_no);

        return res.json({ message: "Student updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function searchStudentController(req, res) {
    try {
        const { reg_no } = req.body;
        if (!reg_no) {
            return res.status(400).json({ message: "Registration number required" });
        }
        const student = await findStudentByRegno(reg_no);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        const { password, ...safeStudent } = student;
        return res.json({ message: "Student found", student: safeStudent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function adminDashboard(req, res) {
    try {
        const { month, year } = req.body;

        if (!month || !year) {
            return res.status(400).json({ message: "Month and year required" });
        }

        const summary = await getDashboardSummary(month, year);

        let totalMeals = 0;
        let totalRevenue = 0;

        const mealStats = summary.map(row => {
            totalMeals += row.count;
            totalRevenue += row.revenue;

            return {
                meal_type: row.meal_type,
                count: row.count,
                price: row.price,
                revenue: row.revenue
            };
        });

        return res.json({
            month,
            year,
            total_meals: totalMeals,
            total_revenue: totalRevenue,
            meal_stats: mealStats
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function deleteStudentController(req, res) {
    try {
        const { reg_no } = req.body;

        if (!reg_no) {
            return res.status(400).json({ message: "Registration number required" });
        }

        const student = await findStudentByRegno(reg_no);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const studentId = student.id;

        await pool.query("DELETE FROM attendance WHERE student_id = ?", [studentId]);
        await pool.query("DELETE FROM meal_block WHERE student_id = ?", [studentId]);

        await deleteStudentByRegNo(reg_no);

        return res.json({ message: "Student deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
async function getStudentsListController(req, res) {
  try {
    const { hostel } = req.body;
    if (!hostel) {
      return res.status(400).json({ message: "Hostel block required" });
    }
    
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

    const active = finalStudents.filter(s => !s.blocked).length;
    const blocked = finalStudents.filter(s => s.blocked).length;

    res.json({
      students: finalStudents,
      stats: { active, blocked }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
async function getCaterersController(req, res) {
  try {
    const caterers = await getCaterers();
    res.json(caterers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { adminDashboard, searchStudentController, updateStudentController, 
    deleteStudentController, studentReportController, getStudentsListController, getCaterersController };