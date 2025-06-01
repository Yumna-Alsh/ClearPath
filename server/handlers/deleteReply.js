const { connectToDB } = require("../dbClient");

async function deleteReply(req, res) {
  const { reviewId, replyId } = req.params;
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

    // 3) Find the specific reply
    const replyObj = (review.replies || []).find((r) => r._id === replyId);
    if (!replyObj) {
      return res.status(404).json({ error: "Reply not found" });
    }

    // 4) Only the original reply-author can delete
    if (replyObj.username !== user.username) {
      return res.status(403).json({ error: "Forbidden: not your reply" });
    }

    // 5) Pull it from the array
    await db
      .collection("reviews")
      .updateOne({ _id: reviewId }, { $pull: { replies: { _id: replyId } } });

    // 6) Return the updated review (so front‐end can update its state)
    const updatedReview = await db
      .collection("reviews")
      .findOne({ _id: reviewId });
    res.json(updatedReview);
  } catch (err) {
    console.error("Error deleting reply:", err);
    res.status(500).json({ error: "Server error" });
  } 
}

module.exports = deleteReply;
