import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";



const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  let users = [];

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  const addUser = (socketId, newUserId,role) => {
      if (!users.some((user) => user.newUserId === newUserId)) {
        users.push({ socketId, newUserId,role });
      }
  };
  const getUser = (userId) => {
    return users.find((user) => user.newUserId === userId);
  };

  io.on("connection", (socket) => {
    socket.on("newUser", (userId) => {
      addUser(socket.id, userId);
      io.emit("getUsers", users);
     io.emit("getOnlineDoctors",()=>{
      const onlineDoctors=users.filter((user)=> user.role === "doctor")
      return onlineDoctors
     })
      
    });
     
     socket.on("message", (message) => {
       io.emit("received",message)
     })

     
     
       socket.on(
         "sendMessage",
         ({ senderId, receiverId, message }) => {
           const receiver = getUser(receiverId);
           io.to(receiver?.socketId).emit("getMessage", {
             senderId,
             message
           });
         }
     );
     
      socket.on("sendOpenedConv", ({ senderId, receiverId, condition }) => {
        const receiver = getUser(receiverId);
        io.to(receiver?.socketId).emit("getOpenedConv", {
          senderId,
          condition,
        });
      
      });
      socket.on("logout", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
        io.emit("getOnlineDoctors",()=>{
          const onlineDoctors=users.filter((user)=> user.role === "doctor")
          return onlineDoctors
         })
      });
      socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getOnlineDoctors",()=>{
          const onlineDoctors=users.filter((user)=> user.role === "doctor")
          return onlineDoctors
         })
        io.emit("getUsers", users);
      });
   });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});