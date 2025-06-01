const signup = require("./signup.js");
const login = require("./login.js");
const getLocations = require("./getLocations.js");
const addLocation = require("./addLocation.js");
const getUserInfo = require("./getUserInfo.js");
const editUser = require("./editUser.js");
const getUserLocations = require("./getUserLocations.js");
const forgotPassword = require("./forgotPassword.js");
const addReview = require("./addReview.js");
const getUserReviews = require("./getUserReviews.js");
const getLocationReviews = require("./getLocationReviews.js");
const likeReview = require("./likeReview.js");
const unlikeReview = require("./unlikeReview.js");
const addReply = require("./addReply.js");
const editReview = require("./editReview.js");
const deleteReview = require("./deleteReview.js");
const editReply = require("./editReply.js");
const deleteReply = require("./deleteReply.js");
const contact = require("./contact.js");

module.exports = {
  signup,
  login,
  forgotPassword,
  getLocations,
  addLocation,
  getUserInfo,
  editUser,
  getUserLocations,
  addReview,
  getUserReviews,
  getLocationReviews,
  likeReview,
  unlikeReview,
  addReply,
  editReview,
  deleteReview,
  editReply,
  deleteReply,
  contact,
};
