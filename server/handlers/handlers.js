const signup = require("./signup.js");
const login = require("./login.js");
const getLocations = require("./getLocations.js");
const addLocation = require("./addLocation.js");
const getUserInfo = require("./getUserInfo.js");
const { uploadMiddleware, editUserHandler } = require("./editUser.js");
const getUserLocations = require("./getUserLocations.js");
const forgotPassword = require("./forgotPassword.js");
const resetPassword = require("./resetPassword.js");
const addReview = require("./addReview.js");
const getUserReviews = require("./getUserReviews.js");
const getLocationReviews = require("./getLocationReviews.js");
const toggleLikeReview = require ("./toggleLikeReview.js");
const toggleLikeReply = require ("./toggleLikeReply.js");
const addReply = require("./addReply.js");
const editReview = require("./editReview.js");
const deleteReview = require("./deleteReview.js");
const editReply = require("./editReply.js");
const deleteReply = require("./deleteReply.js");
const toggleFavLocation = require("./toggleFavLocation.js");
const getUserFavorites = require ("./getUserFavorites.js")

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getLocations,
  addLocation,
  getUserInfo,
  editUserHandler, 
  uploadMiddleware,  
  getUserLocations,
  addReview,
  getUserReviews,
  getLocationReviews,
  toggleLikeReview,
  toggleLikeReply,
  addReply,
  editReview,
  deleteReview,
  editReply,
  deleteReply,
  toggleFavLocation,
  getUserFavorites,
};
