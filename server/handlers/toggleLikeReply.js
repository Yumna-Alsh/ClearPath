const { connectToDB } = require("../dbClient");

async function toggleLikeReply(req, res) {
  const { reviewId, replyId } = req.params;
  const accessToken = req.cookies.auth;

  // Require authentication
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db = await connectToDB();

    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Locate the review and reply to update
    const review = await db.collection("reviews").findOne({ _id: reviewId });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const reply = (review.replies || []).find((r) => r._id === replyId);
    if (!reply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    const username = user.username;
    const likedBy = reply.likedBy || [];
    const hasLiked = likedBy.includes(username);

    // Toggle like status
    const updatedLikedBy = hasLiked
      ? likedBy.filter((u) => u !== username)
      : [...likedBy, username];

    // Update reply's likedBy field
    await db
      .collection("reviews")
      .updateOne(
        { _id: reviewId, "replies._id": replyId },
        { $set: { "replies.$.likedBy": updatedLikedBy } }
      );

    res.json({
      likedBy: updatedLikedBy,
      liked: !hasLiked,
    });
  } catch (error) {
    console.error("Error toggling reply like:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = toggleLikeReply;
