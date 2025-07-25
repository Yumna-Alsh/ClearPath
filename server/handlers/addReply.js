const { connectToDB } = require("../dbClient");
const { v4: uuidv4 } = require("uuid");

async function addReply(req, res) {
  const { reviewId } = req.params;
  const { text } = req.body;
  const accessToken = req.cookies.auth;

  // Require authentication token
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db = await connectToDB();

    // Validate user by access token
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Create new reply object with timestamp and username
    const reply = {
      _id: uuidv4(),
      text,
      username: user.username,
      createdAt: new Date(),
    };

    // Append reply to review's replies array
    const result = await db
      .collection("reviews")
      .updateOne({ _id: reviewId }, { $push: { replies: reply } });

    // Check if review was found and updated
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(201).json(reply);
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = addReply;