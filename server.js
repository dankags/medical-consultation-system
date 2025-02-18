import { createServer } from "node:http";
import next from "next";
// import { Server } from 'socket.io';
import { initSocket } from "./src/lib/socketServer.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

//app server and socket preperation
app.prepare().then(async() => {
  const httpServer = createServer(handler);
  await initSocket(httpServer)


  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});






