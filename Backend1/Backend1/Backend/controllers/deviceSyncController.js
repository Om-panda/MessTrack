const { pool } = require('../config/db');
const pendingStudents = {};
const pendingBlocks = {};

async function requestSync(req, res) {

    try {

        const { hostel_block } = req.body;

        if (!hostel_block) {

            return res.status(400).json({
                message: 'Hostel block required'
            });
        }

        await pool.query(
            `UPDATE devices
             SET sync_pending = TRUE
             WHERE hostel_block = ?`,
            [hostel_block]
        );

        res.json({
            message:
            `Sync requested for ${hostel_block}`
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
}

async function checkSync(req, res) {

    try {

        const device_id = req.device.device_id;

        const [rows] = await pool.query(
            `SELECT sync_pending
             FROM devices
             WHERE device_id = ?`,
            [device_id]
        );

        res.json({
            sync_required:
            rows[0].sync_pending
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
}

async function clearSync(req, res) {

    try {

        const device_id = req.device.device_id;

        await pool.query(
            `UPDATE devices
             SET sync_pending = FALSE
             WHERE device_id = ?`,
            [device_id]
        );

        res.json({
            message: 'Sync cleared'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
}

async function pushSelectedStudents(req, res) {

    try {

        const {
            hostel_block,
            students
        } = req.body;

        if (
            !hostel_block ||
            !students
        ) {

            return res.status(400).json({
                message: 'Invalid data'
            });
        }

        pendingStudents[hostel_block] =
            students;

        res.json({
            message:
            'Students queued successfully'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
}

async function getPendingStudents(req, res) {

    try {

        const hostel_block =
            req.device.hostel_block;

        const students =
            pendingStudents[hostel_block]
            || [];

        pendingStudents[hostel_block] = [];

        res.json({
            students
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
}

async function pushBlockedMeal(
    hostel_block,
    reg_no,
    meal_type
) {

    if (!pendingBlocks[hostel_block]) {

        pendingBlocks[hostel_block] = [];
    }

    pendingBlocks[hostel_block].push({

        reg_no,

        meal_type
    });
}

async function getPendingBlocks(req, res) {

    try {

        const hostel_block =
            req.device.hostel_block;

        const blocks =
            pendingBlocks[hostel_block]
            || [];

        pendingBlocks[hostel_block] = [];

        res.json({
            blocks
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
}


module.exports = { requestSync, checkSync, clearSync, pushSelectedStudents, getPendingStudents, pushBlockedMeal, getPendingBlocks };