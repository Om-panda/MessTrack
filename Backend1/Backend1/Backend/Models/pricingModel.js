const { pool } = require('../config/db');

async function setPrice(meal_type, price, effective_from) {
    await pool.query(
        `INSERT INTO pricing (meal_type, price, effective_from)
         VALUES (?, ?, ?)`,
        [meal_type, price, effective_from]
    );
}

async function getPrice(meal_type) {
    const [rows] = await pool.query(
        `SELECT price FROM pricing WHERE meal_type = ?`,
        [meal_type]
    );
    return rows[0];
}

async function getAllPrices() {
    const [rows] = await pool.query(`
        SELECT meal_type, price
        FROM pricing
        WHERE id IN (
            SELECT MAX(id)
            FROM pricing
            GROUP BY meal_type
        )
    `);
    return rows;
}

module.exports = { setPrice, getPrice, getAllPrices };