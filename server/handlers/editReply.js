const { connectToDB } = require("../dbClient");

async function editReply(req, res) {
  const { reviewId, replyId } = req.params;
  const { text: newText } = req.body;
  const accessToken = req.cookies.auth;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!newText || !newText.trim()) {
    return res.status(400).json({ error: "Empty reply not allowed" });
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

    // 3) Find the reply in the array
    const replyObj = (review.replies || []).find((r) => r._id === replyId);
    if (!replyObj) {
      return res.status(404).json({ error: "Reply not found" });
    }

    // 4) Only the original reply‐author can edit
    if (replyObj.username !== user.username) {
      return res.status(403).json({ error: "Forbidden: not your reply" });
    }

    // 5) Use an arrayFilter to update the embedded reply text
    await db.collection("reviews").updateOne(
      { _id: reviewId, "replies._id": replyId },
      {
        $set: { "replies.$.text": newText },
      }
    );

    // 6) Return the updated review (so front‐end can read new replies array)
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
