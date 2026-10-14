
const mediasoup = require("mediasoup");

let worker;

async function startMediasoup() {
  worker = await mediasoup.createWorker();

  console.log("Mediasoup worker started!");
  console.log("Worker ID:", worker.pid);
}

module.exports = {
  worker,
  startMediasoup,
};

