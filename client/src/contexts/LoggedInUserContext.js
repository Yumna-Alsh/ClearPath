import React, { createContext, useState, useEffect } from "react";

// Create a context to hold the logged-in user data
export const LoggedInUserContext = createContext();

// Context provider component to wrap around parts of the app that need user state
export const LoggedInUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to set user data upon successful login
  const logIn = (userData) => {
    setUser(userData);
  };

  // Function to clear user data upon logout
  const logOut = () => {
    setUser(null);
  };

  useEffect(() => {
    // Check for an existing user session on initial load
    const checkSession = async () => {
      try {
        const res = await fetch("/profile", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          // Session is valid; update user state
          setUser(data.user);
        } else {
          // No valid session found; reset user
          setUser(null);
        }
      } catch (err) {
        // Handle network or parsing errors gracefully
        console.error("Failed to fetch user session", err);
        setUser(null);
      }
    };

    checkSession(); // Run session check when provider mounts
  }, []);

  return (
    // Make user data and auth handlers available to children components
    <LoggedInUserContext.Provider value={{ user, setUser, logIn, logOut }}>
      {children}
    </LoggedInUserContext.Provider>
  );
};
