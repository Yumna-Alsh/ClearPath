const { connectToDB } = require("../dbClient");


async function likeReview(req, res) {
  // ← Use "id" here, because your route is "/reviews/:id/like"
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

    // 3) If the user already liked it, we cannot like again
    if (review.likedBy && review.likedBy.includes(user.username)) {
      return res.status(400).json({ error: "You already liked this review" });
    }

    // 4) Increment likes and push username into likedBy
    await db.collection("reviews").updateOne(
      { _id: reviewId },
      {
        $inc: { likes: 1 },
        $push: { likedBy: user.username },
      }
    );

    // 5) Return the updated counts (so the front‐end can update the UI)
    const updated = await db.collection("reviews").findOne({ _id: reviewId });
    res.json({
      likes: updated.likes || 0,
      likedBy: updated.likedBy || [],
    });
  } catch (error) {
    console.error("Error liking review:", error);
    res.status(500).json({ error: "Server error" });
  } 
}

module.exports = likeReview;
