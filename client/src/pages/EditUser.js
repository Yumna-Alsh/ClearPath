import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../contexts/LoggedInUserContext";

const EditUser = () => {
  // Access current user data and logIn function from context
  const { user, logIn } = useContext(LoggedInUserContext);
  const navigate = useNavigate();

  // Initialize form fields from current user info or default empty strings
  const initialState = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    about: user?.about || "",
    profilePic: user?.profilePic || "",
  };

  // State variables for form inputs and submission status/message
  const [firstName, setFirstName] = useState(initialState.firstName);
  const [lastName, setLastName] = useState(initialState.lastName);
  const [username, setUsername] = useState(initialState.username);
  const [about, setAbout] = useState(initialState.about);
  const [profilePic, setProfilePic] = useState(initialState.profilePic);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Ref to access the hidden file input for profile picture
  const fileInputRef = useRef();

  // Handles previewing the selected profile picture as a base64 string for immediate UI feedback
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // base64 preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Handles the form submission for editing the user profile
  const handleEdit = async () => {
    setMessage("");
    setIsSubmitting(true);

    // Basic validation for required fields
    if (!firstName.trim() || !username.trim()) {
      setMessage("First name and username are required");
      setIsSubmitting(false);
      return;
    }

    if (username.length < 3) {
      setMessage("Username must be at least 3 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare form data to send including the actual profile picture file (if any)
      const formData = new FormData();
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName?.trim() || "");
      formData.append("username", username.trim());
      formData.append("about", about?.trim() || "");

      if (fileInputRef.current.files[0]) {
        formData.append("profilePic", fileInputRef.current.files[0]);
      }

      // Send PATCH request to update user profile, including credentials for authentication
      const res = await fetch("/edit-user", {
        method: "PATCH",
        credentials: "include",
        body: formData,
        // Content-Type is omitted to let browser set multipart/form-data boundary
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Update failed");
      }

      // Update user context with new data and display success message
      const data = await res.json();
      logIn({ ...user, ...data.user });
      setMessage("Profile updated successfully");

      // Redirect to profile page after short delay
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      setMessage(error.message || "Update failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resets the form inputs and preview to their initial values
  const handleReset = () => {
    setFirstName(initialState.firstName);
    setLastName(initialState.lastName);
    setUsername(initialState.username);
    setAbout(initialState.about);
    setProfilePic(initialState.profilePic);
    fileInputRef.current.value = null; // Clear file input value
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-white flex justify-center p-8 font-['AlfaSlabOne-Regular'] text-[#202254]">
      <div className="w-full max-w-lg">
        <h2 className="text-3xl mb-6 border-b-2 border-[#216a78] pb-2">
          Edit Profile
        </h2>

        {/* Profile picture preview and file input trigger */}
        <div className="flex items-center mb-8 space-x-4">
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#216a78]"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#216a78] text-white flex items-center justify-center text-xl font-semibold">
              {firstName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current.click()}
            className="text-[#216a78] border border-[#216a78] rounded-md px-4 py-1 text-sm hover:bg-[#216a78] hover:text-white transition"
          >
            Change
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicChange}
          />
        </div>

        {/* Form fields for user information */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-1 font-semibold">First name</label>
            <input
              className="w-full border-b-2 border-[#216a78] focus:outline-none p-2 text-lg"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Last name</label>
            <input
              className="w-full border-b-2 border-[#216a78] focus:outline-none p-2 text-lg"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">Username</label>
          <input
            className="w-full border-b-2 border-[#216a78] focus:outline-none p-2 text-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">About</label>
          <textarea
            className="w-full border-2 border-[#216a78] rounded-md p-3 text-lg resize-none focus:outline-none"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell your story"
          />
        </div>

        {/* Display success or error message */}
        {message && (
          <p
            className={`mb-4 text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Reset and Save buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="border border-[#216a78] text-[#216a78] px-6 py-2 rounded-md text-lg font-semibold hover:bg-[#216a78] hover:text-white transition"
          >
            Reset
          </button>
          <button
            onClick={handleEdit}
            disabled={isSubmitting}
            className={`bg-[#216a78] text-white px-6 py-2 rounded-md text-lg font-semibold hover:bg-[#1e595e] transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;