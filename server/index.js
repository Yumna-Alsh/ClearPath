const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getLocations,
  addLocation,
  getUserInfo,
  uploadMiddleware,
  editUserHandler,
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
} = require("./handlers/handlers.js");

const app = express();
const PORT = 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
require("fs").mkdirSync(uploadsDir, { recursive: true });

// Middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(uploadsDir));

// Routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/forgot-password", forgotPassword);
app.post("/reset-password", resetPassword);
app.post("/locations", addLocation);
app.post("/locations/:locationId/reviews", addReview);
app.post("/reviews/:id/toggle-like", toggleLikeReview);
app.post("/reviews/:reviewId/replies/:replyId/like", toggleLikeReply);
app.post("/reviews/:reviewId/replies", addReply);
app.post("/locations/:locationId/toggle-favorite", toggleFavLocation);

app.get("/locations", getLocations);
app.get("/profile", getUserInfo);
app.get("/my-submissions", getUserLocations);
app.get("/my-reviews", getUserReviews);
app.get("/locations/:id/reviews", getLocationReviews);
app.get("/my-favorites", getUserFavorites);

app.patch("/edit-user", uploadMiddleware, editUserHandler);
app.patch("/reviews/:id", editReview);
app.patch("/reviews/:reviewId/replies/:replyId", editReply);

app.delete("/reviews/:id", deleteReview);
app.delete("/reviews/:reviewId/replies/:replyId", deleteReply);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Start server
app.listen(PORT, () => console.info(`Listening on port ${PORT}`));