import api from "./api";

// Register
export const register = async (userData) => {
  const res = await api.post("/auth/register", userData);// Return the entire response data, which may include user info and token
  return res.data;
};

// Login
export const login = async (userData) => {
  const res = await api.post("/auth/login", userData);
  return res.data;
};