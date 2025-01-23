import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem("token");
};
