const { connectToDB } = require("../dbClient");

const getUserReviews = async (req, res) => {
  const accessToken = req.cookies.auth;
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const db = await connectToDB();
    const user = await db.collection("users").findOne({ accessToken });

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("Current user:", user);
    const reviews = await db
      .collection("reviews")
      .find({ user: user.username })
      .toArray();

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ message: "Server error fetching reviews" });
  }
};

module.exports = getUserReviews;
