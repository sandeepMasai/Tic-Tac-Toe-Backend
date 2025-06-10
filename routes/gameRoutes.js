const express = require('express');
const {
    createGame,
    getGame,
    joinGame,
    makeMove,
    getAvailableGames,
    deleteGame,
} = require('../controllers/gameController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
    .post(protect, createGame); // Create game requires authentication


router.route('/available')
    .get(protect, getAvailableGames); // Get available games

router.route('/:id')
    .get(protect, getGame) // Get specific game
    .delete(protect, deleteGame); // Delete game

router.route('/:id/join')
    .put(protect, joinGame); // Join game

router.route('/:id/move')
    .put(protect, makeMove); // Make a move

module.exports = router;