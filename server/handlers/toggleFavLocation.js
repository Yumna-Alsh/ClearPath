const { connectToDB } = require("../dbClient");

const toggleFavLocation = async (req, res) => {
  const accessToken = req.cookies.auth;
  const { locationId } = req.params;

  // Ensure user is authenticated
  if (!accessToken) return res.status(401).json({ error: "Not logged in" });

  // Ensure location ID is provided
  if (!locationId)
    return res.status(400).json({ error: "Location ID required" });

  try {
    const db = await connectToDB();
    const users = db.collection("users");

    const user = await users.findOne({ accessToken });
    if (!user) return res.status(401).json({ error: "Invalid token" });

    // Check if location is already in user's favorites
    const hasFavorited = user.favorites?.includes(locationId);

    // Add or remove from favorites accordingly
    const update = hasFavorited
      ? { $pull: { favorites: locationId } }
      : { $addToSet: { favorites: locationId } };

    await users.updateOne({ _id: user._id }, update);

    res.json({ favorited: !hasFavorited });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = toggleFavLocation;