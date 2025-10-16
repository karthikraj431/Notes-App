import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const login = (userData) => setUser(userData);
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setUser(null);

      try {
        const res = await axios.get(`${API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setUser(res.data.user);
        else setUser(null);
      } catch (error) {
        console.log(error);
        setUser(null);
      }
    };
    verifyUser();
  }, []);

  return (
    <authContext.Provider
      value={{ user, login, logout, darkMode, toggleDarkMode }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
export default ContextProvider;
