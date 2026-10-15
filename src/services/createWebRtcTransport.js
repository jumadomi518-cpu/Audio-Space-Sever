
const rooms = require("../models/rooms.js");

async function createWebRtcTransport(data) {
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

  const transport = await room.router.createWebRtcTransport({
    listenInfos: [
      {
        protocol: "udp",
        ip: "0.0.0.0",
        announcedAddress: process.env.ANNOUNCED_IP
      }
    ]
  });

  participant.transports.set(transport.id, {
    transport,
    direction: data.direction
  });

  return {
    id: transport.id,
    direction: data.direction,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters
  };
}

module.exports = createWebRtcTransport;

