const { connectToDB } = require("../dbClient");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Configure upload paths and defaults
const avatarsDir = path.join(__dirname, "../uploads/avatars");
const defaultAvatar = "/uploads/default-avatar.png";

// Ensure avatar directory exists
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Configure Multer storage for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

    if (!allowedExtensions.includes(ext)) {
      return cb(new Error("Only image files are allowed"));
    }

    cb(null, `avatar-${Date.now()}${ext}`);
  },
});

// Multer middleware setup with validation
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max: 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
}).single("profilePic");

// Handler to edit user profile details
const editUser = async (req, res) => {
  try {
    const accessToken = req.cookies.auth;
    if (!accessToken)
      return res.status(401).json({ message: "Not authenticated" });

    const db = await connectToDB();

    // Verify user by token
    const user = await db.collection("users").findOne({ accessToken });
    if (!user) return res.status(401).json({ message: "Invalid token" });

    const { firstName, lastName, username, about } = req.body;

    // Basic validation
    if (!firstName?.trim() || !username?.trim()) {
      return res
        .status(400)
        .json({ message: "First name and username are required" });
    }

    // Check for username conflicts
    const existingUser = await db.collection("users").findOne({
      username,
      _id: { $ne: user._id },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Handle profile picture upload
    let profilePicPath = user.profilePic || defaultAvatar;
    if (req.file) {
      profilePicPath = `/uploads/avatars/${req.file.filename}`;

      // Delete old avatar if it's not the default
      if (user.profilePic && user.profilePic !== defaultAvatar) {
        const oldPath = path.join(__dirname, "..", user.profilePic);
        fs.unlink(oldPath, (err) => err && console.error("Delete error:", err));
      }
    }

    // Update user document
    const result = await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          firstName,
          lastName,
          username,
          about,
          profilePic: profilePicPath,
        },
      }
    );

    // No changes were made
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "No changes made" });
    }

    // Return updated user info
    res.status(200).json({
      message: "Profile updated",
      user: {
        firstName,
        lastName,
        username,
        about,
        profilePic: profilePicPath,
      },
    });
  } catch (err) {
    console.error("Edit error:", err);

    // Clean up uploaded file on error
    if (req.file) {
      const filePath = path.join(avatarsDir, req.file.filename);
      fs.existsSync(filePath) && fs.unlink(filePath, () => {});
    }

    res.status(500).json({
      message: err.message.includes("Only image")
        ? err.message
        : "Server error during update",
    });
  }
};

module.exports = {
  uploadMiddleware: upload,
  editUserHandler: editUser,
};
