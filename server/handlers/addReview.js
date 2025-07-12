const { connectToDB } = require("../dbClient");
const { v4: uuidv4 } = require("uuid");

async function addReview(req, res) {
  const { accessibilityRating, comment } = req.body;
  const { locationId } = req.params;
  const accessToken = req.cookies.auth;

  // Basic validation and authorization check
  if (!accessToken) return res.status(401).json({ error: "Unauthorized" });
  if (!locationId || !comment || !accessibilityRating) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (accessibilityRating < 1 || accessibilityRating > 5) {
    return res.status(400).json({ error: "Rating must be between 1-5" });
  }

  try {
    const db = await connectToDB();

    // Authenticate user
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) return res.status(401).json({ error: "Invalid token" });

    // Confirm location exists
    const location = await db
      .collection("locations")
      .findOne({ _id: locationId });
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    // Create new review document
    const review = {
      _id: uuidv4(),
      user: user.username,
      locationId,
      comment,
      accessibilityRating: Number(accessibilityRating),
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
      replies: [],
    };

    // Use transaction to insert review and update location ratings atomically
    const session = db.client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection("reviews").insertOne(review, { session });

        // Calculate updated average rating for the location
        const reviews = await db
          .collection("reviews")
          .find({ locationId }, { session })
          .toArray();

        const avgRating =
          reviews.reduce((sum, r) => sum + r.accessibilityRating, 0) /
          reviews.length;

        // Update location with new average rating and increment review count
        await db.collection("locations").updateOne(
          { _id: locationId },
          {
            $set: {
              averageAccessibilityRating: parseFloat(avgRating.toFixed(1)),
            },
            $inc: { reviewCount: 1 },
          },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = addReview;