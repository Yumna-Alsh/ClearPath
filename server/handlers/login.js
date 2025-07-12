"use strict";
const bcrypt = require("bcrypt");
const { connectToDB } = require("../dbClient");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter your email and password." });
    }

    const db = await connectToDB();
    const users = db.collection("users");

    // Find user by email and verify password
    const user = await users.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = user.accessToken;

    // Set auth cookie with access token
    res.cookie("auth", accessToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("Setting cookie with token:", accessToken);

    res.status(200).json({
      status: 200,
      data: user,
      userId: user._id,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ status: 500, message: "Server error during login." });
  }
};

module.exports = login;
