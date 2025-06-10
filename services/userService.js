const User = require('../models/User');

// get user profile by id
const getUserProfileById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    return user;
};

//  Update user profile
const updateUserService = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    return user;
};

module.exports = {
    getUserProfileById,
    updateUserService,
   
};