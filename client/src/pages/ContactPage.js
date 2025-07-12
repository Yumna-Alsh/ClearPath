import React, { useState } from "react";

// Contact page component providing a form to send messages via Formspree
export default function ContactPage() {
  // State to hold form input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Handles form input changes, updating the corresponding state property
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow rounded">
      {/* Page heading with custom font styling */}
      <h1
        className="text-2xl mb-4 text-[#202254]"
        style={{ fontFamily: "AlfaSlabOne-Regular, serif" }}
      >
        Contact Us
      </h1>

      {/* Contact form configured to submit data to Formspree */}
      <form
        action="https://formspree.io/f/mwpbgzoa"
        method="POST"
        className="space-y-4 text-sm text-gray-800"
      >
        {/* Name input field with required validation */}
        <input
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#216a78]"
        />
        {/* Email input field with required validation */}
        <input
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#216a78]"
        />
        {/* Message textarea with required validation */}
        <textarea
          name="message"
          rows="4"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#216a78]"
        ></textarea>

        {/* Submit button*/}
        <button
          type="submit"
          className="bg-[#216a78] text-white px-4 py-2 rounded hover:bg-[#1a5664]"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
