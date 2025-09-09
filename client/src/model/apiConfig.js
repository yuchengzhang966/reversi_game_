import { readCookie } from "../utils/cookie";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const createAPI = (endpoint) => `${BASE_URL}${endpoint}`;

// User
const LOGIN = createAPI("/api/user/login");
const LOGOUT = createAPI("/api/user/logout");
const REGISTER = createAPI("/api/user/register");
const GET_USER_INFO = createAPI("/api/userinfo");

const GET_LEADERBOARD = createAPI("/api/userInfo/userLeaderBoard");

// Room
const CREATE_ROOM = createAPI("/api/room/createRoom");

const createHeader = () => {
  return {
    headers: {
      "auth-token": readCookie("_token"),
    },
  };
};

export { LOGIN, LOGOUT, REGISTER, GET_USER_INFO, CREATE_ROOM, GET_LEADERBOARD, createHeader };
