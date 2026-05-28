const { createBlock } = require('../Models/blockModel');

async function blockMealController(req, res) {
    try {
        const { student_id, start_date, end_date, meal_types } = req.body;

        if (!student_id || !start_date || !end_date || !meal_types?.length) {
            return res.status(400).json({ message: "All fields required" });
        }

        const validMeals = ['breakfast', 'lunch', 'snacks', 'dinner'];

        const invalid = meal_types.some(m => !validMeals.includes(m));
        if (invalid) {
            return res.status(400).json({ message: "Invalid meal type" });
        }

        const today = new Date().toISOString().split('T')[0];

        if (start_date <= today) {
            return res.status(400).json({
                message: "Block must be at least 1 day in advance"
            });
        }

        if (end_date < start_date) {
            return res.status(400).json({
                message: "End date must be after start date"
            });
        }

        const diffDays =
            (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24);

        if (diffDays > 30) {
            return res.status(400).json({
                message: "Block range too large (max 30 days)"
            });
        }

            try {
            await createBlock(student_id, start_date, end_date, meal_types);
        } catch (err) {

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    message: "Block already exists for selected meal and date range"
                });
            }

            throw err;
        }

        return res.json({
            message: "Meal block created successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { blockMealController };