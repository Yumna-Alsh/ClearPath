const { connectToDB } = require("../dbClient");

const getLocationReviews = async (req, res) => {
  const locationId = req.params.id;
  console.log("GET /locations/:id/reviews called with:", locationId); // add this

  try {
    const db = await connectToDB();
    const reviews = await db
      .collection("reviews")
      .find({ locationId })
      .toArray();

    console.log("Found reviews:", reviews); // add this

    res.json(reviews);
  } catch (err) {
    console.error("Error in getLocationReviews:", err);
    res.status(500).json({ error: "Error fetching reviews" });
  }
};

module.exports = getLocationReviews;
