
 const { randomUUID } = require("crypto");
 const rooms = require("../models/rooms.js");
 const { worker } = require("./mediasoup.js");
 const mediaCodecs = [
  {
    kind: 'audio',
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2
  }
];



 async function createRoom() {
  const roomId = randomUUID();
  const router = await worker.createRouter({
    mediaCodecs
  });

   const room = {
    id: roomId,
    participants: new Map(),
    router: router
  };

   rooms.set(roomId, room);

   return roomId;
 }

module.exports = createRoom;
