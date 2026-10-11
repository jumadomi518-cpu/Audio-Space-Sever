
 const rooms = require("../models/rooms.js");
 const connections = require("../models/connections.js");

 function realTime(ws) {
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
