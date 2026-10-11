
 const { randomUUID } = require("crypto");
 const rooms = require("../models/rooms.js");

 function createRoom() {
  const roomId = randomUUID();

   const room = {
    id: roomId,
    participants: new Map()
  };

   rooms.set(roomId, room);

   return roomId;
 }

module.exports = createRoom;
