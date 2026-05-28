const { pool } = require('../config/db');

async function runCleanup() {
    try {
        console.log('Running cleanup job...');

        await pool.query(`
            DELETE FROM attendance 
            WHERE date < NOW() - INTERVAL 45 DAY
        `);

        await pool.query(`
            DELETE FROM meal_block 
            WHERE end_date < NOW() - INTERVAL 45 DAY
        `);

        console.log('Cleanup completed');
    } catch (error) {
        console.error('Cleanup error:', error);
    }
}

runCleanup();

setInterval(runCleanup, 24 * 60 * 60 * 1000);

module.exports = {};