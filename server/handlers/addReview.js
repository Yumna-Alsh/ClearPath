const { connectToDB } = require("../dbClient");
const { v4: uuidv4 } = require("uuid");

async function addReview(req, res) {
  const { accessibilityRating, comment } = req.body;
  const { locationId } = req.params;
  const accessToken = req.cookies.auth;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  console.log("locationId:", locationId);
  console.log("accessibilityRating:", accessibilityRating);
  console.log("comment:", comment);

  if (
    !locationId ||
    accessibilityRating === undefined ||
    accessibilityRating === null ||
    !comment
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const db = await connectToDB();

    const user = await db.collection("users").findOne({ accessToken });

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const reviews = db.collection("reviews");

    const review = {
      _id: uuidv4(),
      user: user.username,
      locationId,
      comment,
      accessibilityRating: Number(accessibilityRating) || 0,
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
      replies: [],
    };

    await reviews.insertOne(review);

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error inserting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = addReview;
