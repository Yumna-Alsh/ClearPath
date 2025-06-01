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
    const accessToken = req.cookies.auth;
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await connectToDB();

    const user = await db.collection("users").findOne({ accessToken });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const fullAddress = `${address}, ${city}, ${province}, ${postalCode}, ${country}`;
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        fullAddress
      )}`
    );
    const geoData = await geoRes.json();

    if (!geoData.length) {
      return res
        .status(400)
        .json({ error: "Could not find coordinates for the address" });
    }

    const coordinates = {
      lat: parseFloat(geoData[0].lat),
      lng: parseFloat(geoData[0].lon),
    };

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
    };

    await db.collection("locations").insertOne(location);

    res.status(201).json({ message: "Location added"});
  } catch (err) {
    console.error("Error adding location:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = addLocation;
