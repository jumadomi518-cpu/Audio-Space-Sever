
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



const transportEntry = participant.transports.get(
  data.transportId
);

if (!transportEntry) {
  throw new Error("Transport not found");
}

const transport = transportEntry.transport;


  if (!transport) {
    return { successful: false, message: "Transport not found" };
  }

  try {
    const producer = await transport.produce({
      kind: data?.kind,
      rtpParameters: data?.rtpParameters
    });

    participant.producers.set(producer.id, producer);

console.log("PRODUCER CREATED:", {
  id: producer.id,
  kind: producer.kind,
  type: producer.type,
  paused: producer.paused,
  closed: producer.closed,
  appData: producer.appData
});

console.log("PRODUCER RTP PARAMETERS:", producer.rtpParameters);

   setTimeout(async () => {
  try {
    const stats = await producer.getStats();

    console.log("PRODUCER STATS COUNT:", stats.length);
    console.dir(stats, { depth: null });
  } catch (error) {
    console.error("PRODUCER STATS ERROR:", error);
  }
}, 5000);



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
