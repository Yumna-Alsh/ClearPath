const { connectToDB } = require("../dbClient");

const getUserInfo = async (req, res) => {
  const accessToken = req.cookies.auth;

  // Verify authentication
  if (!accessToken) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const db = await connectToDB();

    // Find user by access token
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const {
      firstName,
      username,
      profilePic,
      favorites = [],
      reportedLocations = [],
    } = user;

    // Fetch favorite location details
    const favoriteLocations = await db
      .collection("locations")
      .find({ _id: { $in: favorites } })
      .toArray();

    // Return profile info with favorite locations
    res.status(200).json({
      user: {
        firstName,
        username,
        profilePic,
        favorites: favoriteLocations,
        reportedLocations,
      },
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = getUserInfo;