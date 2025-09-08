// For testing purpose, without any database connection
const User = require("../model/User");
const log = require("../utils/log");

/**
 * Connet user to the room 
 * @param {Object} newUser
 * @param {Object} rooms 
 */
function registerUser(rooms, newUser) {
  const roomId = newUser.room;

  // Check Rooms
  if (rooms.hasOwnProperty(newUser.room)) {
    // Check Users
    if (CheckUserExist(rooms[roomId], newUser) === false) {
      rooms[newUser.room] = [
        ...rooms[newUser.room],
        {
          user: newUser.user,
          socketId: newUser.socketId,
          room: newUser.room,
        },
      ];
    }
  } else {
    rooms[newUser.room] = [
      {
        user: newUser.user,
        socketId: newUser.socketId,
        room: newUser.room,
      },
    ];
  }
}

function CheckUserExist(room, user) {
  for (let i = 0; i < room.length; i++) {
    if (room[i].username === user.username) {
      // Change the Socket Id
      room[i].socketId = user.socketId;
      return true;
    }
  }
  return false;
}

async function findUser(userId){
  try{
    const user = await User.findById(userId).lean();
    delete user.password;
    return user;
  }catch(e){
    log(e.message, "error");
  }
}

module.exports = {
  registerUser: registerUser,
  findUser: findUser,
};
