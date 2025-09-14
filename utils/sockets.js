const socket = require("socket.io");
const crypto = require("crypto");

const getRoomId = (id1, id2) => {
  const raw = [id1, id2].sort().join("_");
  return crypto.createHash("sha256").update(raw).digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, _id, targetId }) => {
      const roomId = getRoomId(_id, targetId);
      socket.join(roomId);
      console.log(`${firstName} joined room ${roomId}`);
    });

    socket.on("sendMessage", ({ firstName, _id, targetId, text }) => {
      const roomId = getRoomId(_id, targetId);

      const message = {
        senderId: _id,
        senderName: firstName,
        receiverId: targetId,
        text,
        time: new Date().toISOString(),
      };

      console.log(`${firstName} sent a message to ${targetId}: ${text}`);

      io.to(roomId).emit("messageReceived", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
