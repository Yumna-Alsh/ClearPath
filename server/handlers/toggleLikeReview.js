const { connectToDB } = require("../dbClient");

async function toggleLikeReview(req, res) {
  const { id: reviewId } = req.params;
  const accessToken = req.cookies.auth;

  // Require login
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db = await connectToDB();

    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Locate the review
    const review = await db.collection("reviews").findOne({ _id: reviewId });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const username = user.username;
    const hasLiked = review.likedBy && review.likedBy.includes(username);

    // Toggle like count and likedBy array
    if (hasLiked) {
      await db.collection("reviews").updateOne(
        { _id: reviewId },
        {
          $inc: { likes: -1 },
          $pull: { likedBy: username },
        }
      );
    } else {
      await db.collection("reviews").updateOne(
        { _id: reviewId },
        {
          $inc: { likes: 1 },
          $push: { likedBy: username },
        }
      );
    }

    const updated = await db.collection("reviews").findOne({ _id: reviewId });

    res.json({
      likes: updated.likes || 0,
      likedBy: updated.likedBy || [],
      liked: !hasLiked,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = toggleLikeReview;