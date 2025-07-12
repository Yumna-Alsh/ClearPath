const { connectToDB } = require("../dbClient");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch");

const addLocation = async (req, res) => {
  const {
    name,
    address,
    city,
    province,
    postalCode,
    country,
    type,
    accessibility,
  } = req.body;

  // Validate all required fields are present
  if (
    !name ||
    !address ||
    !city ||
    !province ||
    !postalCode ||
    !country ||
    !type ||
    !accessibility
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Verify user authentication via access token cookie
    const accessToken = req.cookies.auth;
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await connectToDB();

    // Find user by token
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Use OpenStreetMap API to geocode full address
    const fullAddress = `${address}, ${city}, ${province}, ${postalCode}, ${country}`;
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        fullAddress
      )}`
    );
    const geoData = await geoRes.json();

    // Handle case where coordinates are not found
    if (!geoData.length) {
      return res
        .status(400)
        .json({ error: "Could not find coordinates for the address" });
    }

    // Parse latitude and longitude
    const coordinates = {
      lat: parseFloat(geoData[0].lat),
      lng: parseFloat(geoData[0].lon),
    };

    // Construct location document with initial stats
    const location = {
      _id: uuidv4(),
      name,
      address,
      city,
      province,
      postalCode,
      country,
      coordinates,
      type,
      accessibility,
      createdAt: new Date(),
      user: user.username,
      averageAccessibilityRating: 0,
      reviewCount: 0,
    };

    // Insert new location into database
    await db.collection("locations").insertOne(location);

    res.status(201).json({ message: "Location added" });
  } catch (err) {
    console.error("Error adding location:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = addLocation;