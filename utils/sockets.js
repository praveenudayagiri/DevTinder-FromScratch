const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../config/chat");

const getRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetId }) => {
      if (!userId || !targetId) {
        console.log("joinChat missing ids", { userId, targetId });
        return;
      }
      const roomId = getRoomId(userId, targetId);
      socket.join(roomId);
        console.log(`${firstName} joined room ${roomId}`);
        console.log("Current rooms:", socket.rooms);

    });

    socket.on("sendMessage", async ({ firstName, lastName, userId, targetId, text }) => {
      try {
        if (!userId || !targetId) {
          console.log("sendMessage missing ids", { userId, targetId });
          return;
        }

        const roomId = getRoomId(userId, targetId);

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
        });

        await chat.save();

        io.to(roomId).emit("messageReceived", {
          firstName,
          lastName,
          text,
        });
      } catch (err) {
        console.error("Error in sendMessage:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
