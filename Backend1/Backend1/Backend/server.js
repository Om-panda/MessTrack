process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

require('dotenv').config();
require('./utils/cleanup');

const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, ()=> {
        console.log(`Server is runnig on port ${PORT}`);
    });
}).catch((err) =>{
    console.error('Faild to connect to the database',err);
});