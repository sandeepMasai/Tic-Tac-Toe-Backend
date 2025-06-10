const Game = require('../models/Game');
const {
    createGameService,
    getGameByIdService,
    joinGameService,
    makeMoveService,
    getAvailableGamesService,
    deleteGameService,
} = require('../services/gameService');
const { getIo } = require('../services/socketService'); 


exports.createGame = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        const game = await createGameService(userId);
        res.status(201).json({ message: 'Game created successfully', game });
    } catch (error) {
        next(error);
    }
};


exports.getGame = async (req, res, next) => {
    try {
        const { id } = req.params;
        const game = await getGameByIdService(id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(game);
    } catch (error) {
        next(error);
    }
};


exports.joinGame = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const game = await joinGameService(id, userId);

        if (!game) {
            return res.status(404).json({ message: 'Game not found or already full' });
        }

        // Emit update to players in the game
        const io = getIo();
        io.to(game._id.toString()).emit('gameUpdated', game); 
        // Emit to the game room

        res.json({ message: 'Joined game successfully', game });
    } catch (error) {
        next(error);
    }
};


exports.makeMove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { position } = req.body; 
        const userId = req.user.id;

        const game = await makeMoveService(id, userId, position);

        if (!game) {
            return res.status(404).json({ message: 'Game not found or invalid move' });
        }

        // Emit update to players in the game
        const io = getIo();
        io.to(game._id.toString()).emit('gameUpdated', game); // Emit to the game room

        res.json({ message: 'Move made successfully', game });
    } catch (error) {
        next(error);
    }
};


exports.getAvailableGames = async (req, res, next) => {
    try {
        const games = await getAvailableGamesService();
        res.json(games);
    } catch (error) {
        next(error);
    }
};


exports.deleteGame = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
         // Assuming only creator can delete, or admin

        const result = await deleteGameService(id, userId); 
        // Pass userId for authorization in service

        if (!result) {
            return res.status(404).json({ message: 'Game not found or unauthorized to delete' });
        }
        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        next(error);
    }
};