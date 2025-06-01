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

    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const review = await db.collection("reviews").findOne({ _id: reviewId });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const replyObj = (review.replies || []).find((r) => r._id === replyId);
    if (!replyObj) {
      return res.status(404).json({ error: "Reply not found" });
    }

    if (replyObj.username !== user.username) {
      return res.status(403).json({ error: "Forbidden: not your reply" });
    }

    await db.collection("reviews").updateOne(
      { _id: reviewId, "replies._id": replyId },
      {
        $set: { "replies.$.text": newText },
      }
    );

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
