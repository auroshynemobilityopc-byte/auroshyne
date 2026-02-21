const cors = require('cors');

const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : [];

const corsOptions = {
    origin: (origin, callback) => {
        // allow requests with no origin (mobile apps, postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};

module.exports = cors(corsOptions);
// module.exports = cors({
//     origin: true, // allow all origins dynamically
//     credentials: true,
// });