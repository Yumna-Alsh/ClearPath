import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignupImage from "../assets/signup-image.png";

const SignupPage = () => {
  // State variables for form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Handle form submission to send signup data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    if (res.ok) {
      alert("Signup successful!");
      navigate("/"); // Redirect on success
    } else {
      alert("Signup failed.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row font-['AlfaSlabOne-Regular'] text-[#202254]">
      <div
        className="absolute inset-0 md:relative md:w-1/2 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${SignupImage})` }}
      />

      {/* Signup form container */}
      <div className="flex justify-center items-center w-full md:w-1/2 z-10 px-4 py-12 bg-white bg-opacity-50 backdrop-blur-md md:bg-transparent md:backdrop-blur-none">
        <div className="w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-100 bg-white bg-opacity-50 backdrop-blur-md">
          <h2 className="text-3xl text-[#216a78] text-center mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username input */}
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#216a78] outline-none"
              required
            />
            {/* Email input */}
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#216a78] outline-none"
              required
            />
            {/* Password input */}
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#216a78] outline-none"
              required
            />
            {/* Confirm Password input */}
            <input
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#216a78] outline-none"
              required
            />

            {/* Terms acceptance checkbox */}
            <div className="flex items-center space-x-2">
              <input type="checkbox" required />
              <label className="text-sm text-gray-700">
                I accept the terms
              </label>
            </div>

            {/* Link to terms page */}
            <p className="text-sm text-center text-gray-500">
              Please read our
              <Link
                to="/termspage"
                className="text-[#216a78] underline ml-1 hover:text-black"
              >
                Terms of Use
              </Link>
            </p>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-[#202254] hover:bg-[#1b1b44] text-white rounded-lg p-3 font-semibold transition duration-200"
            >
              Sign Up
            </button>

            {/* Link to login page */}
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
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

export default SignupPage;