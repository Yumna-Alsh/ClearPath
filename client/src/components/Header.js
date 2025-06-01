import { useContext, useState, useRef, useEffect } from "react";
import { LoggedInUserContext } from "../contexts/LoggedInUserContext";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logOut } = useContext(LoggedInUserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "";
    const parts = nameOrEmail.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  };

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
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center h-20">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="h-20" />
          </Link>

          <nav className="flex items-center gap-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-[#216a78] transition">
              Home
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="w-10 h-10 rounded-full bg-[#216a78] text-white font-bold flex items-center justify-center"
                  title={user.username || user.email}
                >
                  {getInitials(user.username || user.email)}
                </button>

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
