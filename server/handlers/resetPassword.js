const bcrypt = require("bcrypt");
const { connectToDB } = require("../dbClient");

const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  // Basic field validation
  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Password match validation
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const db = await connectToDB();
    const users = db.collection("users");

    // Find user by reset token
    const user = await users.findOne({ resetToken: token });

    // Check token validity and expiration
    if (!user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password and update user record
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await users.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" }, // Clear reset token
      }
    );

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = resetPassword;
