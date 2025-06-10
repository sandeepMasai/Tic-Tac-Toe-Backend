const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            console.log(`CORS error: Origin ${origin} not in allowed list. Allowed: ${allowedOrigins}`); 
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        console.log(`CORS allowed for origin: ${origin}`); 
        return callback(null, true);
    },
    credentials: true 
}));

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);

// Root route (optional)
app.get('/', (req, res) => {
    res.send('Tic-Tac-Toe API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;