
 const { randomUUID } = require("crypto");
 const rooms = require("../models/rooms.js");

 function joinRoom(data) {


  const participantId = randomUUID();
  const room = rooms.get(data?.roomId);

  if (!room) {
   return { successful: false }
  }


  const participant = {
    name: data?.name,
    id: participantId,
    isHost: data?.isHost,
    microphone: "muted",
    hand: "lowered",
    transports: new Map(),
    producers: new Map(),
    consumers: new Map()
  }

  const existingParticipant = [...room.participants.values()]
    .find(p => p.id === data.participantId);

  if (existingParticipant) {
    return {
      successful: true,
      participantId: existingParticipant.id
    };
  }

   room.participants.set(participantId, participant);

   return {
    successful: true,
    participantId: participantId,
    rtpCapabilities: room.router.rtpCapabilities
   };
 }

module.exports = joinRoom;

