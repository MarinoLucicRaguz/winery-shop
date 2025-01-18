import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.userId;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  }
  return null;
};
