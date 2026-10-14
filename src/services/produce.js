
const rooms = require("../models/rooms.js");

async function produce(data) {
  const room = rooms.get(data?.roomId);

  if (!room) {
    return { successful: false, message: "Room not found" };
  }

  const participant = room.participants.get(
    data?.participantId
  );

  if (!participant) {
    return { successful: false, message: "Participant not found" };
  }

  const transport = participant.transports.get(
    data?.transportId
  );

  if (!transport) {
    return { successful: false, message: "Transport not found" };
  }

  try {
    const producer = await transport.produce({
      kind: data?.kind,
      rtpParameters: data?.rtpParameters
    });

    participant.producers.set(producer.id, producer);

    producer.on("transportclose", () => {
      participant.producers.delete(producer.id);
    });

    producer.on("close", () => {
      participant.producers.delete(producer.id);
    });

    return {
      successful: true,
      producerId: producer.id,
      kind: producer.kind
    };
  } catch (error) {
    return {
      successful: false,
      message: error.message
    };
  }
}

module.exports = produce;
