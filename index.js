require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const { setupSockets } = require("./sockets");

// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

// Setup WebSockets for real-time collaboration
setupSockets(io);

// Sync Database and start server
sequelize.sync()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
