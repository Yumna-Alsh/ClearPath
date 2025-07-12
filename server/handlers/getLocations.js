const { connectToDB } = require("../dbClient");

const getLocations = async (req, res) => {
  try {
    const db = await connectToDB();

    // Retrieve all location entries from the database
    const locations = await db.collection("locations").find().toArray();

    res.status(200).json({ locations });
  } catch (error) {
    console.error("Error fetching locations:", error);

    res.status(500).json({ error: "Server error" });
  }
};

module.exports = getLocations;
