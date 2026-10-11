
 const joinRoom = require("../services/joinRoom.js");

 function joinRoomController(req, res) {
  const data = req.body;
  const result = joinRoom(data);

  if (!result.successful) {
    return res.status(404).json(result);
  }

  return res.json(result);


 }

module.exports = joinRoomController;

