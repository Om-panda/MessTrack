const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const studentRoutes = require('./routes/studentroutes');
const authRoutes = require('./routes/authroutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const blockRoutes = require('./routes/blockRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const billingRoutes = require('./routes/billingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const catererRoutes = require('./routes/catererRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const syncRoutes = require('./routes/syncRoutes');
const rfidRoutes = require('./routes/rfidRoutes');




app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/block', blockRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/caterer', catererRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/rfid', rfidRoutes);



app.get('/', (req , res) => {
    res.send('Server is running');
});

app.use((err, req, res, next) => {
    console.error('Global Error:', err);

    res.status(500).json({
        message: 'Something went wrong',
        error: err.message
    });
});

module.exports = app;