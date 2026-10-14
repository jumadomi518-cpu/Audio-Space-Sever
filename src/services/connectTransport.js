
const rooms = require("../models/rooms.js");

async function connectTransport(data) {
  const room = rooms.get(data.roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  const participant = room.participants.get(
    data.participantId
  );

  if (!participant) {
    throw new Error("Participant not found");
  }

  const transport = participant.transports.get(
    data.transportId
  );

  if (!transport) {
    throw new Error("Transport not found");
  }

  await transport.connect({
    dtlsParameters: data.dtlsParameters
  });

  return {
    successful: true,
    transportId: transport.id
  };
}

module.exports = connectTransport;
