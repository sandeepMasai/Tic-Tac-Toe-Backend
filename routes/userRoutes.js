const express = require('express');
const { getUserProfile, getUserById } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
 // Get logged-in user's profile
router.get('/:id', protect, getUserById);
 // Get user by ID (for opponent names etc.)
 

module.exports = router;