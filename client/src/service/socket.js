import io from "socket.io-client";

// Use an environment variable for the backend URL, defaulting to localhost for development.
const ENDPOINT = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export const socket = io(ENDPOINT, {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
});
