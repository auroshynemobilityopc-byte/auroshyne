const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Car Wash API',
            version: '1.0.0',
            description: 'Car Wash Booking System API Docs',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        './src/modules/auth/auth.routes.js',
        './src/modules/users/user.routes.js',
        './src/modules/technicians/technician.routes.js',
        './src/modules/services/service.routes.js',
        './src/modules/addons/addon.routes.js',
        './src/modules/bookings/booking.routes.js',
        './src/modules/payments/payment.routes.js',
        './src/modules/invoices/invoice.routes.js',
        './src/modules/dashboard/dashboard.routes.js',
        './src/modules/technicians/jobs/technicianJobs.routes.js',
    ],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
