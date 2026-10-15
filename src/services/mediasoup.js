

const mediasoup = require("mediasoup");

let worker;

async function startMediasoup() {
  worker = await mediasoup.createWorker();

  console.log("Mediasoup worker started!");
  console.log("Worker ID:", worker.pid);

  return worker;
}

function getWorker() {
  if (!worker) {
    throw new Error("Mediasoup worker has not been initialized");
  }

  return worker;
}

module.exports = {
  startMediasoup,
  getWorker,
};
