const { connectToDB } = require("../dbClient");

// Handler to edit a review's comment and/or accessibility rating
async function editReview(req, res) {
  const { id: reviewId } = req.params;
  const { comment, accessibilityRating } = req.body;
  const accessToken = req.cookies.auth;

  // Check if user is authenticated
  if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

  // Validate request: must update at least one field
  if (!comment?.trim() && !accessibilityRating) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  // Validate rating range
  if (
    accessibilityRating &&
    (accessibilityRating < 1 || accessibilityRating > 5)
  ) {
    return res.status(400).json({ error: "Rating must be between 1-5" });
  }

  try {
    const db = await connectToDB();

    // Find the user by access token
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) return res.status(401).json({ error: "Invalid token" });

    // Fetch review by ID
    const review = await db.collection("reviews").findOne({ _id: reviewId });
    if (!review) return res.status(404).json({ error: "Review not found" });

    // Ensure user is the review author
    if (review.user !== user.username) {
      return res.status(403).json({ error: "Not your review" });
    }

    // Build update object
    const update = {};
    if (comment) update.comment = comment;
    if (accessibilityRating)
      update.accessibilityRating = Number(accessibilityRating);

    // Apply the update
    await db
      .collection("reviews")
      .updateOne({ _id: reviewId }, { $set: update });

    // Recalculate location rating if necessary
    if (accessibilityRating) {
      await updateLocationRating(db, review.locationId);
    }

    // Return updated review
    const updated = await db.collection("reviews").findOne({ _id: reviewId });
    res.json(updated);
  } catch (err) {
    console.error("Error editing review:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = editReview;