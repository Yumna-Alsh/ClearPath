const { connectToDB } = require("../dbClient");

const getUserFavorites = async (req, res) => {
  const accessToken = req.cookies.auth;

  // Ensure the user is authenticated
  if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    const db = await connectToDB();

    // Retrieve user from DB using access token
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) return res.status(401).json({ message: "Invalid token" });

    const locationIds = user.favorites || [];

    // Fetch favorite locations based on stored IDs
    const locations = await db
      .collection("locations")
      .find({ _id: { $in: locationIds } })
      .toArray();

    res.status(200).json({ favorites: locations });
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getUserFavorites;
