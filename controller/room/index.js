const { func } = require("joi");
const Room = require("../../model/Room");
const RoomModel = require("../../model/Room");
const UserModel = require("../../model/User");
const log = require("../../utils/log");
const { deleteSid } = require("../connect/index");

async function findAllRooms(){
  try {
    const room = await RoomModel.find().select('roomId').lean().exec();
    return { data: room };
  } catch (e) {
    return { message: "Fail to Find Room", error: e.message };
  }
}

/**
 * Find Room Info by Room Code
 *
 * @param   {String}  roomCode  eg. 'XDMFS'
 *
 * @return  {Object}  Room Info
 */
async function findRoom(roomCode) {
  try {
    const room = await RoomModel.findOne({ roomId: roomCode })
      .populate("currentPlayers")
      .exec();
    return { data: room };
  } catch (e) {
    return { message: "Fail to Find Room", error: e.message };
  }
}

/**
 * return a list of rooms that are active
 * @return room list
 */
async function findActiveRoom() {
  try {
    const room = await RoomModel.find({ isActive: true })
      .populate("currentPlayers")
      .exec();
    return { data: room };
  } catch (e) {
    return { message: "Fail to find active rooms", error: e.message };
  }
}


async function checkIsFull(roomCode) {
  try {
    const room = await RoomModel.findOne({ roomId: roomCode });

    if (room.currentPlayers.length === 2) {
      await RoomModel.findOneAndUpdate({ roomId: roomCode }, { isFull: true });
    }
  } catch (e) {
    throw e;
  }
}

/**
 * let one user join a specific room
 * @param   {String}  userId
 * @param   {String}  roomId
 * @return  room
 */
async function joinRoom(userId, roomId) {
  try {
    // Update Room
    const conditions = {
      roomId: roomId,
      currentPlayers: { $ne: userId },
    };
    const update = {
      $push: { currentPlayers: userId },
    };
    const currentRoom = await RoomModel.findOneAndUpdate(conditions, update, {
      new: true,
    })
      .lean()
      .exec();
    // If room exist, and user never joined before, then join the room

    await checkIsFull(roomId);

    // Update User
    const res = await UserModel.findByIdAndUpdate(
      userId,
      { currentRoom: roomId },
      { new: true }
    );
    log(`[USER JOIN]: ${userId} Joined ROOM: ${roomId}`, "success");

    return currentRoom;
  } catch (e) {
    console.log(e);
    log(`[USER JOIN]: ${userId} unable to join ${roomId}`, "error");
    return { message: "Unable To Join Room", error: e.message };
  }
}

/**
 * delete a room from the database
 * @param   {String}  roomId
 */
async function destroyRoom(roomId) {
  try {
    await RoomModel.deleteOne({ roomId: roomId });
    log(`[ROOM DESTROY]: ${roomId} destroyed`, "success");
  } catch (e) {
    log(`[ROOM DESTROY]: ${roomId} ${e.message}`, "error");
  }
}

/**
 * let one user leave a specific room
 * @param   {String}  userId
 * @param   {String}  roomId
 * @return  room
 */
async function leaveRoom(userId, roomId) {
  try {
    // Delete Room from user
    await UserModel.findByIdAndUpdate(userId, { currentRoom: "" });
    // await deleteSid(userId);
    const conditions = {
      roomId: roomId,
    };
    const update = {
      $pull: { currentPlayers: userId },
      isFull: false,
    };
    const currentRoom = await RoomModel.findOneAndUpdate(conditions, update, {
      new: true,
    })
      .populate("currentPlayers")
      .lean()
      .exec();
    // If Current Room has nobody, then destroy the room
    if (currentRoom && currentRoom.currentPlayers.length === 0)
      destroyRoom(roomId);
    // Update User Status
    log(`[USER LEFT]: ${userId} Leaved Room ${roomId}`, "success");
    // if(!currentRoom) return null;

    return currentRoom;
  } catch (e) {
    console.log(e);
    log(`[USER LEFT]: ${userId} unable to leave ${roomId}`, "error");
    return { message: "Unable To Leave Room", error: e.message };
  }
}

exports.joinRoom = joinRoom;
exports.leaveRoom = leaveRoom;
exports.findRoom = findRoom;
exports.findActiveRoom = findActiveRoom;
exports.findAllRooms = findAllRooms;
exports.destroyRoom = destroyRoom;
