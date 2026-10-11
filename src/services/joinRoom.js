
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
    hand: "lowered"
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
    participantId: participantId
   };
 }

module.exports = joinRoom;

