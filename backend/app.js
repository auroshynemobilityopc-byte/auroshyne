const express = require('express');
const app = express();
const mongoose = require('mongoose');

const authRoutes = require('./src/modules/auth/auth.routes');
const userRoutes = require('./src/modules/users/user.routes');
const technicianRoutes = require('./src/modules/technicians/technician.routes');
const serviceRoutes = require('./src/modules/services/service.routes');
const addonRoutes = require('./src/modules/addons/addon.routes');
const bookingRoutes = require('./src/modules/bookings/booking.routes');
const paymentRoutes = require('./src/modules/payments/payment.routes');
const invoiceRoutes = require('./src/modules/invoices/invoice.routes');
const dashboardRoutes = require('./src/modules/dashboard/dashboard.routes');
const technicianJobsRoutes = require('./src/modules/technicians/jobs/technicianJobs.routes');

const errorHandler = require('./src/common/middleware/error.middleware');
const { globalLimiter } = require('./src/common/middleware/rateLimit.middleware');
const cors = require('./src/config/cors');

/**
 * ✅ TRUST PROXY (for rate limit behind proxy)
 */
app.set('trust proxy', 1);

app.use(cors);
app.use(express.json());

/**
 * 🩺 HEALTH CHECK (no rate limit)
 */
app.use('/api/health', async (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        status: 'OK',
        services: {
            api: 'UP',
            database: 'UNKNOWN',
        },
    };

    try {
        const dbState = mongoose.connection.readyState;

        if (dbState === 1) {
            healthcheck.services.database = 'UP';
        } else {
            healthcheck.services.database = 'DOWN';
            healthcheck.status = 'DEGRADED';
        }

        return res.status(200).json(healthcheck);
    } catch (err) {
        healthcheck.status = 'DOWN';
        healthcheck.services.database = 'DOWN';

        return res.status(503).json(healthcheck);
    }
});

/**
 * 🔒 RATE LIMIT
 */
app.use(globalLimiter);

/**
 * 🧩 ROUTES
 */
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/technicians', technicianRoutes);
app.use('/services', serviceRoutes);
app.use('/addons', addonRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/technician-jobs', technicianJobsRoutes);

app.use(errorHandler);

module.exports = app;
