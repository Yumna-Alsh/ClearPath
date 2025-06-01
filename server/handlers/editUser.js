const { connectToDB } = require("../dbClient");

const editUser = async (req, res) => {
  console.log("PATCH /edit-user received");
  const { id, username, firstName, lastName, about } = req.body;

  if (!id || (!username && !firstName && !lastName && !about)) {
    return res.status(400).json({
      message: "User ID and at least one field to update are required.",
    });
  }

  try {
    const db = await connectToDB();
    const users = db.collection("users");

    const user = await users.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const updateFields = {};
    if (username) updateFields.username = username;
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (about) updateFields.about = about;

    await users.updateOne({ _id: id }, { $set: updateFields });

    res.status(200).json({ message: "User information updated successfully." });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error during update." });
  } 
};

module.exports = editUser;
