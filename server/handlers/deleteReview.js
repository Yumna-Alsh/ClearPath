const { connectToDB } = require("../dbClient");

async function deleteReview(req, res) {
  const { id: reviewId } = req.params;
  const accessToken = req.cookies.auth;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db = await connectToDB();

    // 1) Verify user
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // 2) Load the review
    const review = await db.collection("reviews").findOne({ _id: reviewId });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // 3) Only the original author can delete
    if (review.user !== user.username) {
      return res.status(403).json({ error: "Forbidden: not your review" });
    }

    // 4) Delete the review
    await db.collection("reviews").deleteOne({ _id: reviewId });

    res.json({ message: "Review deleted successfully", reviewId });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Server error" });
  } 
}

module.exports = deleteReview;
