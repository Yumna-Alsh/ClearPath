const { connectToDB } = require("../dbClient");

async function unlikeReview(req, res) {
  // ← Again, use "id" because your route is "/reviews/:id/unlike"
  const { id: reviewId } = req.params;
  const accessToken = req.cookies.auth;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db = await connectToDB();

    // 1) Find the user from the token
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // 2) Find the review by its _id
    const review = await db.collection("reviews").findOne({ _id: reviewId });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // 3) If the user hasn't liked it yet, they can't unlike
    if (!review.likedBy || !review.likedBy.includes(user.username)) {
      return res.status(400).json({ error: "You have not liked this review" });
    }

    // 4) Decrement likes and pull the username from likedBy
    await db.collection("reviews").updateOne(
      { _id: reviewId },
      {
        $inc: { likes: -1 },
        $pull: { likedBy: user.username },
      }
    );

    // 5) Return the updated counts
    const updated = await db.collection("reviews").findOne({ _id: reviewId });
    res.json({
      likes: updated.likes || 0,
      likedBy: updated.likedBy || [],
    });
  } catch (error) {
    console.error("Error unliking review:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = unlikeReview;
