const { connectToDB } = require("../dbClient");

async function deleteReply(req, res) {
  const { reviewId, replyId } = req.params;
  const accessToken = req.cookies.auth;

  // Ensure the user is authenticated
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db = await connectToDB();

    // Find the user making the request
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Find the review containing the reply
    const review = await db.collection("reviews").findOne({ _id: reviewId });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Locate the reply by ID
    const replyObj = (review.replies || []).find((r) => r._id === replyId);
    if (!replyObj) {
      return res.status(404).json({ error: "Reply not found" });
    }

    // Only the author of the reply can delete it
    if (replyObj.username !== user.username) {
      return res.status(403).json({ error: "Forbidden: not your reply" });
    }

    // Remove the reply from the review
    await db
      .collection("reviews")
      .updateOne({ _id: reviewId }, { $pull: { replies: { _id: replyId } } });

   // Return the updated review
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
