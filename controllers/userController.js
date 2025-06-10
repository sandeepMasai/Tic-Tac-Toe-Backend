const User = require('../models/User');


exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      wins: user.wins || 0,
      losses: user.losses || 0,
      draws: user.draws || 0,
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      wins: user.wins || 0,
      losses: user.losses || 0,
      draws: user.draws || 0,
    });
  } catch (error) {
    console.error('Error in getUserById:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
