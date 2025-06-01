const express = require("express");
const cookieParser = require("cookie-parser");

const {
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
} = require("./handlers/handlers.js");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.post("/signup", signup);
app.post("/login", login);
app.post("/forgot-password", forgotPassword);
app.post("/locations", addLocation);
app.post("/locations/:locationId/reviews", addReview);
app.post("/reviews/:id/like", likeReview);
app.post("/reviews/:reviewId/replies", addReply);
app.post("/contact", contact);

app.get("/locations", getLocations);
app.get("/profile", getUserInfo);
app.get("/my-submissions", getUserLocations);
app.get("/my-reviews", getUserReviews);
app.get("/locations/:id/reviews", getLocationReviews);

app.patch("/edit-user", editUser);
app.post("/reviews/:id/unlike", unlikeReview);

app.patch("/reviews/:id", editReview);
app.patch("/reviews/:reviewId/replies/:replyId", editReply);

app.delete("/reviews/:id", deleteReview);
app.delete("/reviews/:reviewId/replies/:replyId", deleteReply);

app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
