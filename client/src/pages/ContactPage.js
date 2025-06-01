import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("Thank you! We'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(data.error || "Failed to send message.");
      }
    } catch (err) {
      setStatus("Server error. Please try again later.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow rounded">
      <h1
        className="text-2xl mb-4 text-[#202254]"
        style={{ fontFamily: "AlfaSlabOne-Regular, serif" }}
      >
        Contact Us
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-800">
        <input
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#216a78]"
        />
        <input
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#216a78]"
        />
        <textarea
          name="message"
          rows="4"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#216a78]"
        ></textarea>
        <button
          type="submit"
          className="bg-[#216a78] text-white px-4 py-2 rounded hover:bg-[#1a5664]"
        >
          Send Message
        </button>
        {status && <p className="text-sm text-[#202254] mt-2">{status}</p>}
      </form>
    </div>
  );
}