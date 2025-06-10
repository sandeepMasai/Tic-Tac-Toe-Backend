const mongoose = require('mongoose');

const gameSchema = mongoose.Schema(
    {
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        board: {
            type: Array,
            default: Array(9).fill(null),
        },
        currentPlayer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        status: {
            type: String,
            enum: ['waiting', 'in-progress', 'finished'],
            default: 'waiting',
        },
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        draw: {
            type: Boolean,
            default: false,
        },
        moves: [
            {
                player: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                position: {
                    type: Number,
                    min: 0,
                    max: 8,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        turnCount: { type: Number, default: 0 },
        gameMode: { type: String, enum: ['vs-player', 'vs-ai'], default: 'vs-player' },
    },
    {
        timestamps: true, 
    }
);

module.exports = mongoose.model('Game', gameSchema);