import React, { createContext, useState, useEffect } from "react";

export const LoggedInUserContext = createContext();

export const LoggedInUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logIn = (userData) => {
    setUser(userData);
  };

  const logOut = () => {
    setUser(null);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/profile", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user); 
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user session", err);
        setUser(null);
      }
    };

    checkSession();
  }, []);

  return (
    <LoggedInUserContext.Provider value={{ user, logIn, logOut }}>
      {children}
    </LoggedInUserContext.Provider>
  );
};
