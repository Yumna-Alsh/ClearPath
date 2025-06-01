const { connectToDB } = require("../dbClient");

const getUserInfo = async (req, res) => {
  const accessToken = req.cookies.auth;

  if (!accessToken) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const db = await connectToDB();
    const user = await db.collection("users").findOne({ accessToken });

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { firstName, username } = user;
    res.status(200).json({ user: { firstName, username } });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Server error" });
  } 
};
module.exports = getUserInfo;
