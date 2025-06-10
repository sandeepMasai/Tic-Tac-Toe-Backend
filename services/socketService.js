let io;

const initSocket = (httpServer) => {
    io = require('socket.io')(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // When a player joins a game, they should also join a Socket.IO room for that game
        socket.on('joinGameRoom', (gameId) => {
            socket.join(gameId);
            console.log(`User ${socket.id} joined game room: ${gameId}`);
        });

        socket.on('leaveGameRoom', (gameId) => {
            socket.leave(gameId);
            console.log(`User ${socket.id} left game room: ${gameId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initSocket, getIo };