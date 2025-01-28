import { createServer } from "node:http";
import next from "next";
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let io = null;
let users = [];

const removeUser = (socketId) => {
users = users.filter((user) => user.socketId !== socketId);
};
const addUser = (socketId, newUserId, role) => {
  if (!users.some((user) => user.newUserId === newUserId)) {
    users.push({ socketId, newUserId,role,status:"free"});
  }
};
const getUser = (userId) => {
return users.find((user) => user.newUserId === userId);
}; 

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


// socket functions initialization and geting the socket
 const initSocket =async (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*", // Adjust the origin to your frontend URL in production
        methods: ["GET", "POST"],
      },
    });
  
    console.log('Socket.IO server initialized');

    io.on('connection', (socket) => {
        socket.on("newUser", ({ userId, role }) => {
            addUser(socket.id,userId,role);
            io?.emit("getUsers", users);
            const onlineDoctors = users.filter((user) => user.role === "doctor");
        io?.emit("getOnlineDoctors", onlineDoctors);
            
          });
      
       
           socket.on("sendBookingRequest", ({ patientId, doctorId,message }) => {
            const receiver = getUser(doctorId);
            if (receiver) {
              console.log(message)
              io?.to(receiver.socketId).emit("receiveBookingRequest", {
                patientId,
                message,
              });
            } else {
              console.log(`Doctor with ID ${doctorId} is not online.`);
            }
           });
      
           socket.on("sendBookingResponse", ({ patientId, doctorId, urlPath }) => {
            const receiver = getUser(patientId);
            if (receiver) {
              io?.to(receiver.socketId).emit("receiveBookingResponse", {
                doctorId,
                urlPath,
              });
            } else {
              console.log(`Patient with ID ${patientId} is not online.`);
            }
           });
           
      
           socket.on("updateStatus", ({ userId, status }) => {
            const user = getUser(userId);
            if(user){
            user.status = status;
            const otherUsers=users.filter((user)=>user.newUserId!==userId)
            users=[...otherUsers,user]
            const onlineDoctors = users.filter((user) => user.role === "doctor");
            io?.emit("getOnlineDoctors", onlineDoctors);
            io?.emit("getUsers", users);
        }
           })
           
             socket.on(
               "sendPatientNotification",
               ({ patientId, doctorId, message }) => {
               
                 const receiver = getUser(doctorId);
                 if (receiver) {
                  io?.to(receiver.socketId).emit("receivePatientNotification", {
                    patientId,
                    message,
                  });
                } else {
                  console.log(`Doctor with ID ${doctorId} is not online.`);
                }
               }
           );
           
            socket.on("sendNotification", ({ senderId, receiverId, condition }) => {
              const receiver = getUser(receiverId);
              if(receiver){
              io?.to(receiver.socketId).emit("getPatient", {
                senderId,
                condition,
              });
            }
            });
            socket.on("logout", () => {
              removeUser(socket.id);
              io?.emit("getUsers", users);
              const onlineDoctors = users.filter((user) => user.role === "doctor");
        io?.emit("getOnlineDoctors", onlineDoctors);
            });
      
            socket.on("disconnect", () => {
              removeUser(socket.id);
              const onlineDoctors = users.filter((user) => user.role === "doctor");
              io?.emit("getOnlineDoctors", onlineDoctors);
              io?.emit("getUsers", users);
            });
    });
  }
  return io;
};



