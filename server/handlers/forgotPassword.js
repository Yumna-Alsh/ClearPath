const { v4: uuidv4 } = require("uuid");
const { connectToDB } = require("../dbClient");
const sendEmail = require("../utils/sendEmail");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const db = await connectToDB();
    const users = db.collection("users");
    const user = await users.findOne({ email });

    // Avoid revealing whether the email exists or not
    if (!user) {
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = uuidv4();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

    // Store token in DB
    await users.updateOne(
      { _id: user._id },
      { $set: { resetToken, resetTokenExpiry } }
    );

    const resetUrl = `https://yourfrontend.com/reset-password?token=${resetToken}`;

    await sendEmail(
        email,
        "Reset Your Password",
        `
          <h1>Password Reset</h1>
          <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>If you didn't request this, you can ignore this email.</p>
        `
      );

    return res
      .status(200)
      .json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = forgotPassword;
