const { connectToDB } = require("../dbClient");

const getLocationReviews = async (req, res) => {
  const locationId = req.params.id;

  try {
    const db = await connectToDB();
    const reviews = await db
      .collection("reviews")
      .find({ locationId })
      .toArray();

    res.json(reviews);
  } catch (err) {
    console.error("Error in getLocationReviews:", err);
    res.status(500).json({ error: "Error fetching reviews" });
  }
};

module.exports = getLocationReviews;
