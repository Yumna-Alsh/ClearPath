import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../contexts/LoggedInUserContext";

const EditUser = () => {
  const { user, logIn } = useContext(LoggedInUserContext);
  const navigate = useNavigate();

  const initialState = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    about: user?.about || "",
    profilePic: null,
  };

  const [firstName, setFirstName] = useState(initialState.firstName);
  const [lastName, setLastName] = useState(initialState.lastName);
  const [username, setUsername] = useState(initialState.username);
  const [about, setAbout] = useState(initialState.about);
  const [profilePreview, setProfilePreview] = useState(null);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef();

  const handleEdit = async () => {
    setMessage("");

    try {
      const res = await fetch("/edit-user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user._id,
          firstName,
          lastName,
          username,
          about,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        logIn({
          ...user,
          firstName,
          lastName,
          username,
        });

        setMessage("User info updated successfully.");
        setTimeout(() => navigate("/profile"), 1500);
      } else {
        setMessage(data.message || "Update failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred.");
    }
  };

  const handleReset = () => {
    setFirstName(initialState.firstName);
    setLastName(initialState.lastName);
    setUsername(initialState.username);
    setAbout(initialState.about);
    setProfilePreview(null);
    setMessage("");
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center p-8 font-['AlfaSlabOne-Regular'] text-[#202254]">
      <div className="w-full max-w-lg">
        <h2 className="text-3xl mb-6 border-b-2 border-[#216a78] pb-2">
          Edit Profile
        </h2>

        {/* Avatar */}
        <div className="flex items-center mb-8 space-x-4">
          {profilePreview ? (
            <img
              src={profilePreview}
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

        {/* Inputs */}
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

        {message && (
          <p
            className={`mb-4 text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="border border-[#216a78] text-[#216a78] px-6 py-2 rounded-md text-lg font-semibold hover:bg-[#216a78] hover:text-white transition"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleEdit}
            className="bg-[#216a78] text-white px-6 py-2 rounded-md text-lg font-semibold hover:bg-[#1e595e] transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
