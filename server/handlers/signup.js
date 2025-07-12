"use strict";
const { connectToDB } = require("../dbClient");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate required input fields
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const db = await connectToDB();
    const users = db.collection("users");

    // Check for existing account by email
    const existing = await users.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ status: 409, message: "User already exists" });
    }

    // Hash the password and create a unique access token
    const hashedPassword = await bcrypt.hash(password, 10);
    const accessToken = uuidv4();

    // Insert new user into database
    await users.insertOne({
      _id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      accessToken,
      favorites: [],
      profilePic: null,
      firstName: "",
      createdAt: new Date(),
    });

    // Set cookie with access token
    res.cookie("auth", accessToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ status: 201, message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};

module.exports = signup;