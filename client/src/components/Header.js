import { useContext, useState, useRef, useEffect } from "react";
import { LoggedInUserContext } from "../contexts/LoggedInUserContext";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logOut } = useContext(LoggedInUserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Toggle user dropdown menu visibility
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Extracts user initials from full name or email
  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "";
    const parts = nameOrEmail.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Main header container with fixed position */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center h-20">
          {/* Logo linking to home page */}
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="h-20" />
          </Link>

          {/* Navigation links */}
          <nav className="flex items-center gap-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-[#216a78] transition">
              Home
            </Link>

            {/* Conditional rendering based on login status */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar or initials button */}
                <button
                  onClick={toggleDropdown}
                  className="w-10 h-10 rounded-full bg-[#216a78] text-white font-bold flex items-center justify-center overflow-hidden"
                  title={user.username || user.email}
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(user.username || user.email)
                  )}
                </button>

                {/* Dropdown menu for logged-in users */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/submit"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Submit
                    </Link>
                    <button
                      onClick={() => {
                        logOut();
                        setDropdownOpen(false);
                        navigate("/");
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Sign In link for unauthenticated users
              <Link to="/login" className="hover:text-[#216a78] transition">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>
      <div className="h-20" />
    </>
  );
}
