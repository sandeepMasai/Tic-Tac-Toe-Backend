const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
// Route imports
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}



app.use(cors({
  origin: 'tic-tac-toe-rho-nine-61.vercel.app', // or '*' for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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