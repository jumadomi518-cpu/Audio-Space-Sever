
 const createRoom = require("../services/createRoom.js");


 function createRoomController(req, res) {
  const roomId = createRoom();

 if (!roomId) {
  res.json({
   successful: false,
  });
  return;
}

  res.json({
   successful: true,
   roomId: roomId
  });
 }

 module.exports = createRoomController;
