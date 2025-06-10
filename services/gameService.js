const Game = require('../models/Game');
const User = require('../models/User'); 
const { calculateWinner } = require('../utils/helpers');

// Function to create a new game
const createGameService = async (player1Id) => {
    // Check if player1 is already in an 'in-progress' or 'waiting' game
    const existingGame = await Game.findOne({
        'players': player1Id,
        'status': { $in: ['waiting', 'in-progress'] }
    });

    if (existingGame) {
        // Option 1: Prevent creating a new game if already in one
        throw new Error('You are already in an active game.');
        // Option 2: Allow but notify (less restrictive)
        // console.log(`User ${player1Id} is already in a game: ${existingGame._id}`);
        // return existingGame;
    }

    const newGame = new Game({
        players: [player1Id],
        currentPlayer: player1Id, // Player 1 starts
        status: 'waiting',
        board: Array(9).fill(null),
    });
    await newGame.save();
    return newGame;
};

// Function to get a game by ID
const getGameByIdService = async (gameId) => {
    const game = await Game.findById(gameId)
        .populate('players', 'username') 
        .populate('currentPlayer', 'username')
        .populate('winner', 'username');
    return game;
};

// Function to join an existing game
const joinGameService = async (gameId, player2Id) => {
    const game = await Game.findById(gameId);

    if (!game) {
        throw new Error('Game not found');
    }

    if (game.status !== 'waiting') {
        throw new Error('Game is not available for joining');
    }

    if (game.players.length >= 2) {
        throw new Error('Game is already full');
    }

    if (game.players.includes(player2Id)) {
        throw new Error('You are already in this game');
    }

    game.players.push(player2Id);
    game.status = 'in-progress';

    // Ensure currentPlayer is set if it wasn't (should be player1 already)
    if (!game.currentPlayer) {
        game.currentPlayer = game.players[0];
    }

    await game.save();
    return await getGameByIdService(game._id);
};

// Function to make a move
const makeMoveService = async (gameId, userId, position) => {
    const game = await Game.findById(gameId);

    if (!game) {
        throw new Error('Game not found');
    }

    if (game.status !== 'in-progress') {
        throw new Error('Game is not in progress');
    }

    if (!game.players.map(p => p.toString()).includes(userId.toString())) {
        throw new Error('You are not a player in this game');
    }

    if (game.currentPlayer.toString() !== userId.toString()) {
        throw new Error('It is not your turn');
    }

    if (position < 0 || position > 8 || game.board[position] !== null) {
        throw new Error('Invalid move: position is out of bounds or already taken');
    }

    const playerIndex = game.players.findIndex(p => p.toString() === userId.toString());
    const playerMark = playerIndex === 0 ? 'X' : 'O'; // Player 1 is X, Player 2 is O

    game.board[position] = playerMark;
    game.moves.push({ player: userId, position: position });

    const winnerMark = calculateWinner(game.board);

    if (winnerMark) {
        game.status = 'finished';
        game.winner = game.players[playerMark === 'X' ? 0 : 1]; // Set winner based on mark
        // Update user stats
        await User.findByIdAndUpdate(game.winner, { $inc: { wins: 1 } });
        const loserId = game.players.find(p => p.toString() !== game.winner.toString());
        if (loserId) await User.findByIdAndUpdate(loserId, { $inc: { losses: 1 } });
    } else if (!game.board.includes(null)) {
        game.status = 'finished';
        game.draw = true;
        // Update user stats for a draw
        await Promise.all(game.players.map(playerId =>
            User.findByIdAndUpdate(playerId, { $inc: { draws: 1 } })
        ));
    } else {
        // Switch current player
        game.currentPlayer = game.players.find(p => p.toString() !== userId.toString());
    }

    await game.save();
    return await getGameByIdService(game._id); 
};

// Function to get available games (status 'waiting' and less than 2 players)
const getAvailableGamesService = async () => {
    const games = await Game.find({ status: 'waiting', players: { $size: 1 } })
        .populate('players', 'username')
        .sort({ createdAt: -1 }); 
    return games;
};

// Function to delete a game (e.g., if created and no one joins, or admin delete)
const deleteGameService = async (gameId, userId) => {
    const game = await Game.findById(gameId);

    if (!game) {
        return false; 
    }

    // Only allow the creator (first player) to delete if game is waiting, or an admin
    if (game.players[0].toString() !== userId.toString() && game.status === 'waiting') {
        throw new Error('You are not authorized to delete this game');
    }

    await game.deleteOne();
    return true;
};

module.exports = {
    createGameService,
    getGameByIdService,
    joinGameService,
    makeMoveService,
    getAvailableGamesService,
    deleteGameService,
};