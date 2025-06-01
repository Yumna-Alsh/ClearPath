const { connectToDB } = require("../dbClient");

async function editReview(req, res) {
  const { id: reviewId } = req.params;
  const { comment: newComment } = req.body;
  const accessToken = req.cookies.auth;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!newComment || !newComment.trim()) {
    return res.status(400).json({ error: "Empty comment not allowed" });
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

    // 3) Only the original author can edit
    if (review.user !== user.username) {
      return res.status(403).json({ error: "Forbidden: not your review" });
    }

    // 4) Update comment text
    await db
      .collection("reviews")
      .updateOne({ _id: reviewId }, { $set: { comment: newComment } });

    // 5) Return the updated review
    const updated = await db.collection("reviews").findOne({ _id: reviewId });
    res.json(updated);
  } catch (err) {
    console.error("Error editing review:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = editReview;
