const http = require('http'); 
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./services/socketService'); 
const dotenv = require('dotenv');

dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server); // Pass the http server instance

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});