
 const http = require("http");
 const express = require("express");
 const app = express();
 const { WebSocketServer } = require("ws");
 const server = http.createServer(app);
 const wss = new WebSocketServer({ server });
 const cors = require("cors");
 const { randomUUID } = require("crypto");

 app.use(cors());
 app.use(express.json());

 const createRoomRouter = require("./routes/createRoomRouter.js");
 const joinRoomRouter = require("./routes/joinRoomRouter.js");
 const roomRouter = require("./routes/roomRouter.js");
 const realTime = require("./services/realTime.js");

 app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Audio Spaces server is running" });
 });

 app.use("/create-room", createRoomRouter);
 app.use("/join-room", joinRoomRouter);
 app.use("/room/:roomId", roomRouter);


 wss.on("connection", realTime);




 server.listen(3000, () => console.log("Server listening on port 3000"))
