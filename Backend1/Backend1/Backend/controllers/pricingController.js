const { setPrice, getAllPrices } = require('../Models/pricingModel');


async function getAllPricesController(req, res) {
    try {
        const prices = await getAllPrices();
        res.json(prices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


async function setPriceController(req, res) {
    try {
        const { meal_type, price, effective_from } = req.body;

        if (!meal_type || !price || !effective_from) {
            return res.status(400).json({ 
                message: "meal_type, price and effective_from are required" 
            });
        }

        const today = new Date().toISOString().split('T')[0];

        if (effective_from < today) {
            return res.status(400).json({
                message: "Effective date cannot be in the past"
            });
        }

        try {
            await setPrice(meal_type, price, effective_from);
        } catch (err) {

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    message: "Price already set for this meal on this date"
                });
            }

            throw err;
        }

        return res.json({
            message: "Price scheduled successfully",
            data: { meal_type, price, effective_from }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { setPriceController, getAllPricesController };