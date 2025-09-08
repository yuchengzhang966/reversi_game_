import { readCookie } from "./cookie";
import { clearCookies } from "./cookie";

// Check if user logged in
const isLoggedIn = () => {
  return Boolean(readCookie("_token"));
};

const logout = () => {
  // Clear Cookies
  clearCookies();
  window.location.href = "/login";
};

export { isLoggedIn, logout }