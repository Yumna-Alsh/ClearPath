import { useState } from "react";
import { Link } from "react-router-dom";
import ForgotImage from "../assets/signup-image.png";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      alert("Password reset link sent. Please check your email.");
    } else {
      alert("Failed to send reset link. Try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row font-['AlfaSlabOne-Regular'] text-[#202254]">
      {/* Background image */}
      <div
        className="absolute inset-0 md:relative md:w-1/2 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${ForgotImage})` }}
      />

      {/* Form */}
      <div className="flex justify-center items-center w-full md:w-1/2 z-10 px-4 py-12 bg-white bg-opacity-50 backdrop-blur-md md:bg-transparent md:backdrop-blur-none">
        <div className="w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-100 bg-white bg-opacity-50 backdrop-blur-md">
          <h2 className="text-3xl text-[#216a78] text-center mb-6">
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#216a78] outline-none text-sm"
            />

            <button
              type="submit"
              className="w-full bg-[#202254] hover:bg-[#1a1a40] text-white font-bold py-3 rounded-xl transition"
            >
              Send Reset Link
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
              Back to{" "}
              <Link
                to="/login"
                className="text-[#216a78] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;