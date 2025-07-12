import { useState } from "react";

export default function ForgotPasswordForm() {
  // State for email input and message feedback
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Handle submit to send reset link request to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setMessage("If the email exists, you will receive reset instructions.");
      setEmail("");
    } else {
      setMessage("Oops, something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white bg-opacity-50 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 font-['AlfaSlabOne-Regular'] text-[#202254]"
    >
      <label
        htmlFor="email"
        className="block mb-2 font-semibold text-[#202254]"
      >
        Email:
      </label>

      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#216a78] outline-none mb-5"
      />

      <button
        type="submit"
        className="w-full bg-[#202254] hover:bg-[#1b1b44] text-white rounded-lg p-3 font-semibold transition duration-200"
      >
        Send Reset Link
      </button>

      {message && (
        <p
          className={`mt-4 text-center font-semibold ${
            message.includes("Oops") ? "text-red-600" : "text-[#216a78]"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
