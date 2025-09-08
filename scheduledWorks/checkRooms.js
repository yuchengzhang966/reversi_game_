const { findAllRooms, destroyRoom } = require("../controller/room/index");

/**
 * Check the bad rooms every minute
 */
function checkRooms(schedule, io) {
  schedule.scheduleJob("*/1 * * * *", async function () {
    const rooms = await findAllRooms();
    const socketRooms = io.sockets.adapter.rooms;
    rooms.data.forEach((room) => {
        if(!socketRooms[`${room.roomId}`]){
            console.log('[REGULAR CHECK: ROOM ERROR] Not Include ' + room.roomId);
            destroyRoom(room.roomId);
        }
    })
  });
}

module.exports = checkRooms;