import { createContext, useState, useEffect, useCallback } from "react";
import axios from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Called once on mount — restores session from localStorage token
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }
  
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  
    axios
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
        sessionStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Called after login — stores token, sets user
  const login = (token, userData) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user",JSON.stringify(userData));
    setUser(userData);
  };

  // Called after logout — clears everything
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user")
    setUser(null);
  };

  // called after any profile update to sync context with DB
  // Re-fetches /auth/me and updates user state without requiring re-login
  const refreshUser = useCallback(async () => {
    try {
      const res = await axios.get("/auth/me");
      setUser(res.data);
      sessionStorage.setItem("user",JSON.stringify(res.data));
    } catch (err) {
      console.error("refreshUser failed:", err);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser}}>
      {children}
    </AuthContext.Provider>
  );
};