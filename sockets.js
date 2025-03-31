function setupSockets(io) {
  io.on("connection", (socket) => {
      console.log("User connected", socket.id);
      
      socket.on("join-document", (documentId) => {
          socket.join(documentId);
      });
      
      socket.on("edit-document", ({ documentId, content }) => {
          // Broadcast the updated content to others in the same document room
          socket.to(documentId).emit("update-document", content);
      });
      
      socket.on("disconnect", () => {
          console.log("User disconnected", socket.id);
      });
  });
}

module.exports = { setupSockets };