const { connectToDB } = require("../dbClient");

const getUserLocations = async (req, res) => {
  const accessToken = req.cookies.auth;
  if (!accessToken) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const db = await connectToDB();
    const users = db.collection("users");
    const locations = db.collection("locations");

    const user = await users.findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userSubmissions = await locations
      .find({ user: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ submissions: userSubmissions });
  } catch (err) {
    console.error("Error fetching user submissions:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = getUserLocations;
