
 const rooms = require("../models/rooms.js");
 const connections = require("../models/connections.js");
 const createWebRtcTransport = require("./createWebRtcTransport.js");
 const connectTransport = require("./connectTransport.js");
 const produce = require("./produce.js");
 const consume = require("./consume.js");
 const resumeConsumer = require("./resumeConsumer.js");

async function realTime(ws) {
   ws.on("message", async (message) => {
    const data = JSON.parse(message);

    const room = rooms.get(data?.roomId);
    const participant = room?.participants.get(data?.participantId);

    if (data.type === "register") {
      connections.set(data.participantId, ws);
      ws.send(JSON.stringify({
        type: "registered",
      }));
    }

    if (data.type === "get-room-state") {
      const room = rooms.get(data.roomId);
      if (room) {
        ws.send(JSON.stringify({
          type: "room-state",
          participants: [...room.participants.values()]
        }));
       console.log("room state sent")
      }


      }

 if (data.type === "createWebRtcTransport") {
  try {
    const result = await createWebRtcTransport(data);

    ws.send(JSON.stringify({
      type: "webRtcTransportCreated",
      ...result
    }));
  } catch (error) {
    ws.send(JSON.stringify({
      type: "error",
      message: error.message
    }));
  }
}


if (data.type === "connectTransport") {
  try {
    console.log("1. connectTransport request received");
    console.log("Room:", data.roomId);
    console.log("Participant:", data.participantId);
    console.log("Transport:", data.transportId);

    const result = await connectTransport(data);

    console.log("2. Transport connected:", result);

    ws.send(JSON.stringify({
      type: "transportConnected",
      ...result
    }));

    console.log("3. Response sent to frontend");
  } catch (error) {
    console.error("connectTransport failed:", error);

    ws.send(JSON.stringify({
      type: "error",
      message: error.message
    }));
  }
}



if (data.type === "produce") {
  try {
    const result = await produce(data);

    ws.send(JSON.stringify({
      type: "producerCreated",
      ...result
    }));


 const room = rooms.get(data.roomId);

    if (!room) {
      console.error("Room not found during notification");
      return;
    }

    // Notify every other participant in the room
 for (const participant of room.participants.values()) {
  /*if (participant.id === data.participantId) {
    continue;
  }*/

  const participantWs = connections.get(participant.id);

  console.log("Checking listener:", participant.id);
  console.log("WebSocket found:", Boolean(participantWs));

  if (participantWs && participantWs.readyState === 1) {
    participantWs.send(JSON.stringify({
      type: "newProducer",
      roomId: data.roomId,
      producerId: result.producerId,
      kind: result.kind,
      participantId: data.participantId
    }));

    console.log("newProducer sent to:", participant.id);
  }
}

    console.log("New producer announced:", result.producerId);

  } catch (error) {
    ws.send(JSON.stringify({
      type: "error",
      message: error.message
    }));
  }
}



if (data.type === "consume") {
  console.log("Consume request received:", data);

  try {
    const result = await consume(data);

    console.log("Consume service result:", result);

    ws.send(JSON.stringify({
      ...result,
      type: "consumerCreated"
    }));

    console.log("consumerCreated response sent to requester");

  } catch (error) {
    console.error("Consume handler error:", error);

    ws.send(JSON.stringify({
      type: "error",
      message: error.message
    }));
  }
}


if (data.type === "resumeConsumer") {
  try {
    const result = await resumeConsumer(data);

    ws.send(JSON.stringify({
      type: "consumerResumed",
      ...result
    }));
  } catch (error) {
    ws.send(JSON.stringify({
      type: "error",
      message: error.message
    }));
  }
}

    if (data.type === "microphone") {
      if (participant) {
         participant.microphone = data.status;
       for (const [id, p] of room?.participants) {
        const client = connections.get(id);

       if (client?.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: "microphone-update",
          participantId: data.participantId,
          status: data.status
         }));
        console.log("mic update sent")
        }
       }

      }
    }


   if (data.type === "hand") {
      if (participant) {
         participant.hand = data.status;
       for (const [id, p] of room?.participants) {
        const client = connections.get(id);

       if (client?.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: "hand-update",
          participantId: data.participantId,
          status: data.status
         }));
        console.log("hand update sent")
        }
       }

      }
    }
   })

 ws.on("close", () => {
  for (const [participantId, client] of connections) {
    if (client === ws) {
      connections.delete(participantId);
      console.log("Connection removed:", participantId);
      break;
    }
  }
});

 }


 module.exports = realTime;
