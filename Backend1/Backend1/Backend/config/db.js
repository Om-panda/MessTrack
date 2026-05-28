const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    waitForConnections : true,
    connectionLimit : 10,
    queueLimit : 0
});

async function connectDB() {
    try{
        const connection = await pool.getConnection();
        console.log('MySQL Connected Successfully');
        connection.release();
    } catch(err) {
        console.error('Database Connection Failed:', err);
        throw err;
    }
}

module.exports = {connectDB,pool};