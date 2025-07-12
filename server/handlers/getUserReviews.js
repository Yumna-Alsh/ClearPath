const { connectToDB } = require("../dbClient");

const getUserReviews = async (req, res) => {
  const accessToken = req.cookies.auth;

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const db = await connectToDB();

    // Find the user by access token
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Fetch all reviews created by the user
    const reviews = await db
      .collection("reviews")
      .find({ user: user.username })
      .toArray();

    // Fetch location data related to reviews
    const locationIds = reviews.map((r) => r.locationId);
    const locations = await db
      .collection("locations")
      .find({ _id: { $in: locationIds } })
      .toArray();

    // Map location ID to name
    const locationMap = {};
    for (const loc of locations) {
      locationMap[loc._id] = { name: loc.name, _id: loc._id };
    }

    // Attach location name to each review
    const enrichedReviews = reviews.map((review) => ({
      ...review,
      location: locationMap[review.locationId] || null,
    }));

    res.status(200).json({ reviews: enrichedReviews });
  } catch (error) {
    console.error("Error fetching user reviews:", error);

    res.status(500).json({ message: "Server error fetching reviews" });
  }
};

module.exports = getUserReviews;
