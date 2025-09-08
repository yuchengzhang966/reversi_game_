import { CREATE_ROOM, createHeader } from "../apiConfig";
import axios from "axios";

function createRoomModel(userId) {
  return axios.post(CREATE_ROOM, { userId: userId }, createHeader());
}

export { createRoomModel }