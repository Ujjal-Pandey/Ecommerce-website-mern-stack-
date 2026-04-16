// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useRef } from "react";
import { login as loginService, register as registerService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const tokenRef = useRef(null);

  // Load saved user/token when app starts
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      
      // Check if savedUser is a valid JSON string (not null or "undefined")
      if (savedUser && savedUser !== "undefined" && savedToken) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser));
        tokenRef.current = savedToken;
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
      // Clear invalid data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  const login = async (credentials) => {
    const data = await loginService(credentials);
    if (data.token) {
      // Create user object from response (excluding token)
      const user = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      };
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      tokenRef.current = data.token;
      return user;
    }
  };

  const register = async (userData) => {
    const data = await registerService(userData);
    if (data.token) {
      // Create user object from response (excluding token)
      const user = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      };
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      tokenRef.current = data.token;
      return user;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    tokenRef.current = null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin === true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
