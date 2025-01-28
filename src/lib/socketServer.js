"use server"
// import { Server } from 'socket.io';

// let io = null;
// let users = [];

// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
// };
// const addUser = (socketId, newUserId, role) => {
//     if (!users.some((user) => user.newUserId === newUserId)) {
//       users.push({ socketId, newUserId,role,status:"free"});
//     }
// };
// const getUser = (userId) => {
//   return users.find((user) => user.newUserId === userId);
// };

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const initSocket =async (server) => {
//   if (!io) {
//     io = new Server(server, {
//       cors: {
//         origin: "*", // Adjust the origin to your frontend URL in production
//         methods: ["GET", "POST"],
//       },
//     });
//     console.log(io)
//     console.log('Socket.IO server initialized');

//     io.on('connection', (socket) => {
//         socket.on("newUser", ({ userId, role }) => {
//             addUser(socket.id,userId,role);
//             io?.emit("getUsers", users);
//             const onlineDoctors = users.filter((user) => user.role === "doctor");
//         io?.emit("getOnlineDoctors", onlineDoctors);
            
//           });
      
       
//            socket.on("sendBookingRequest", ({ patientId, doctorId,message }) => {
//             const receiver = getUser(doctorId);
//             if (receiver) {
//               console.log(message)
//               io?.to(receiver.socketId).emit("receiveBookingRequest", {
//                 patientId,
//                 message,
//               });
//             } else {
//               console.log(`Doctor with ID ${doctorId} is not online.`);
//             }
//            });
      
//            socket.on("sendBookingResponse", ({ patientId, doctorId, urlPath }) => {
//             const receiver = getUser(patientId);
//             if (receiver) {
//               io?.to(receiver.socketId).emit("receiveBookingResponse", {
//                 doctorId,
//                 urlPath,
//               });
//             } else {
//               console.log(`Patient with ID ${patientId} is not online.`);
//             }
//            });
           
      
//            socket.on("updateStatus", ({ userId, status }) => {
//             const user = getUser(userId);
//             if(user){
//             user.status = status;
//             const otherUsers=users.filter((user)=>user.newUserId!==userId)
//             users=[...otherUsers,user]
//             const onlineDoctors = users.filter((user) => user.role === "doctor");
//             io?.emit("getOnlineDoctors", onlineDoctors);
//             io?.emit("getUsers", users);
//         }
//            })
           
//              socket.on(
//                "sendPatientNotification",
//                ({ patientId, doctorId, message }) => {
               
//                  const receiver = getUser(doctorId);
//                  if (receiver) {
//                   io?.to(receiver.socketId).emit("receivePatientNotification", {
//                     patientId,
//                     message,
//                   });
//                 } else {
//                   console.log(`Doctor with ID ${doctorId} is not online.`);
//                 }
//                }
//            );
           
//             socket.on("sendNotification", ({ senderId, receiverId, condition }) => {
//               const receiver = getUser(receiverId);
//               if(receiver){
//               io?.to(receiver.socketId).emit("getPatient", {
//                 senderId,
//                 condition,
//               });
//             }
//             });
//             socket.on("logout", () => {
//               removeUser(socket.id);
//               io?.emit("getUsers", users);
//               const onlineDoctors = users.filter((user) => user.role === "doctor");
//         io?.emit("getOnlineDoctors", onlineDoctors);
//             });
      
//             socket.on("disconnect", () => {
//               removeUser(socket.id);
//               const onlineDoctors = users.filter((user) => user.role === "doctor");
//               io?.emit("getOnlineDoctors", onlineDoctors);
//               io?.emit("getUsers", users);
//             });
//     });
//   }
//   return io;
// };

// export const getSocket =async () => {
//   console.log(io)
//   if (!io) {
//     throw new Error("Socket.IO not initialized");
//   }
//   return io;
// };
