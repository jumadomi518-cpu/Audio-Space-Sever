
 const rooms = require("../models/rooms.js");
 const connections = require("../models/connections.js");
 const createWebRtcTransport = require("./createWebRtcTransport.js");
 const connectTransport = require("./connectTransport.js");
 const produce = require("./produce.js");
 const resumeConsumer = require("./resumeConsumer.js");

async function realTime(ws) {
   ws.on("message", (message) => {
    const data = JSON.parse(message);

    const room = rooms.get(data?.roomId);
    const participant = room?.participants.get(data?.participantId);

    if (data.type === "register") {
      connections.set(data.participantId, ws);
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
    const result = await connectTransport(data);

    ws.send(JSON.stringify({
      type: "transportConnected",
      ...result
    }));
  } catch (error) {
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
  } catch (error) {
    ws.send(JSON.stringify({
      type: "error",
      message: error.message
    }));
  }
}


if (data.type === "consume") {
  try {
    const result = await consume(data);

    ws.send(JSON.stringify({
      type: "consumerCreated",
      ...result
    }));
  } catch (error) {
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
