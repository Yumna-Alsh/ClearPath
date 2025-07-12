const { connectToDB } = require("../dbClient");

async function editReply(req, res) {
  const { reviewId, replyId } = req.params;
  const { text: newText } = req.body;
  const accessToken = req.cookies.auth;

  // Ensure the user is authenticated
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Disallow empty reply text
  if (!newText || !newText.trim()) {
    return res.status(400).json({ error: "Empty reply not allowed" });
  }

  try {
    const db = await connectToDB();

    // Find user by token
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

   // Look up the review containing the reply
    const review = await db.collection("reviews").findOne({ _id: reviewId });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Find the reply by ID
    const replyObj = (review.replies || []).find((r) => r._id === replyId);
    if (!replyObj) {
      return res.status(404).json({ error: "Reply not found" });
    }

    // Ensure the user owns the reply
    if (replyObj.username !== user.username) {
      return res.status(403).json({ error: "Forbidden: not your reply" });
    }

    // Update the reply
    await db.collection("reviews").updateOne(
      { _id: reviewId, "replies._id": replyId },
      {
        $set: { "replies.$.text": newText },
      }
    );

   // Return the updated review document
    const updatedReview = await db
      .collection("reviews")
      .findOne({ _id: reviewId });
    res.json(updatedReview);
  } catch (err) {
    console.error("Error editing reply:", err);
    res.status(500).json({ error: "Server error" });
  } 
}

module.exports = editReply;
