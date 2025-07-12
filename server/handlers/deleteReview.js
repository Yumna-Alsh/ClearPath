const { connectToDB } = require("../dbClient");

async function deleteReview(req, res) {
  const { id: reviewId } = req.params;
  const accessToken = req.cookies.auth;

  // Check if the user is authenticated
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db = await connectToDB();

    // Look up the user based on the access token
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch the review by its ID
    const review = await db.collection("reviews").findOne({ _id: reviewId });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Ensure the logged-in user is the author of the review
    if (review.user !== user.username) {
      return res.status(403).json({ error: "Forbidden: not your review" });
    }

   // Delete the review
    await db.collection("reviews").deleteOne({ _id: reviewId });

    res.json({ message: "Review deleted successfully", reviewId });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Server error" });
  } 
}

module.exports = deleteReview;
