import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../contexts/LoggedInUserContext";
import SignupImage from "../assets/signup-image.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logIn } = useContext(LoggedInUserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    setError(null);
    setMessage("");

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.message === "Login successful") {
        logIn(data.data);
        setMessage("Login successful!");
        navigate("/");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Error during login. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${SignupImage})` }}
      ></div>

      <div className="relative w-full md:w-1/2 flex items-center justify-center bg-white">
        <div
          className="absolute inset-0 block md:hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${SignupImage})` }}
        ></div>

        <div className="absolute inset-0 md:hidden bg-white bg-opacity-70 backdrop-blur-sm z-0"></div>

        <div className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-xl bg-white bg-opacity-50 backdrop-blur-md mx-4 my-8">
          <h2
            className="text-3xl font-bold mb-6 text-[#216a78] text-center"
            style={{ fontFamily: "AlfaSlabOne-Regular, serif" }}
          >
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#216a78]"
            />

            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#216a78]"
            />

            <Link
              to="/forgot-password"
              className="text-sm text-[#216a78] text-right hover:underline"
            >
              Forgot your password?
            </Link>

            <button
              type="submit"
              disabled={isFetching}
              className="bg-[#202254] text-white py-3 rounded-lg font-semibold transition hover:bg-[#1a1a40] disabled:opacity-60"
            >
              {isFetching ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-green-600 font-medium">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
          )}

          <p className="mt-6 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-[#216a78] font-semibold hover:underline"
            >
              Create one!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
