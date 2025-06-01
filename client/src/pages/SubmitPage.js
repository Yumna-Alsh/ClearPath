import React, { useState } from "react";

export default function AddLocationForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
    type: "",
    accessibility: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(`Location added successfully!`);
        setFormData({
          name: "",
          address: "",
          city: "",
          province: "",
          postalCode: "",
          country: "",
          type: "",
          accessibility: "",
        });
      } else {
        setMessage(result.error || "Failed to add location");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("Server error while submitting location.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f5] flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">
        <h2
          className="text-2xl text-center mb-6 text-[#202254]"
          style={{ fontFamily: "AlfaSlabOne-Regular, serif" }}
        >
          Add New Location
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ["name", "Name"],
            ["address", "Address"],
            ["city", "City"],
            ["province", "Province"],
            ["postalCode", "Postal Code"],
            ["country", "Country"],
          ].map(([key, placeholder]) => (
            <input
              key={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={placeholder}
              required={key !== "postalCode"}
              className="w-full border border-gray-300 rounded-lg p-3 bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#216a78]"
            />
          ))}

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#216a78]"
          >
            <option value="">Select Type</option>
            <option value="restroom">Restroom</option>
            <option value="restaurant">Restaurant</option>
            <option value="public building">Public Building</option>
          </select>

          <textarea
            name="accessibility"
            value={formData.accessibility}
            onChange={handleChange}
            placeholder="Accessibility Info"
            className="w-full border border-gray-300 rounded-lg p-3 bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#216a78]"
            rows={3}
          />

          <button
            type="submit"
            className="w-full bg-[#216a78] text-white py-3 rounded-lg hover:bg-[#1b5a66] transition font-semibold"
          >
            Submit
          </button>

          {message && (
            <p className="text-center text-sm text-[#202254] mt-2">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
