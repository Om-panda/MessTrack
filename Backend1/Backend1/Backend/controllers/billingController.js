const { getStudentBillWithHistory } = require('../Models/billingModel');
const { pool } = require('../config/db');

async function calculateBillController(req, res) {
    try {
        const { student_id, month, year } = req.body;

        if (!student_id || !month || !year) {
            return res.status(400).json({ message: "All fields required" });
        }

        const [students] = await pool.query(
            'SELECT id, name FROM students WHERE id = ?',
            [student_id]
        );

        if (!students.length) {
            return res.status(404).json({ message: "Student not found" });
        }

        const rows = await getStudentBillWithHistory(student_id, month, year);

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

        return res.json({
            student: students[0],
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

async function getMyBillController(req, res) {
    try {
       
        req.body.student_id = req.user.id;

        return calculateBillController(req, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { calculateBillController, getMyBillController };