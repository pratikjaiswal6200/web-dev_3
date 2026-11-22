require("dotenv").config();

const express = require("express");

const http = require("http");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const noteRoutes = require("./routes/noteRoutes");

const adminRoutes = require("./routes/adminRoutes");

const socketHandler = require("./socket/socketHandler");


const app = express();

const server = http.createServer(app);


// Socket.IO Server
const io = new Server(server, {

    cors: {
        origin: "*"
    }

});


// Middleware
app.use(express.json());


// Home Route
app.get("/", (req, res) => {

    res.send("Secure Connect Platform API is Running!");

});


// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/notes", noteRoutes);

app.use("/api/admin", adminRoutes);


// Socket.IO Handler
socketHandler(io);


// Not Found Handler
app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route not found"

    });

});


// Global Error Handler
app.use((err, req, res, next) => {

    console.error(err);

    let statusCode = err.statusCode || 500;

    if (err.name === "ValidationError" || err.name === "CastError") {
        statusCode = 400;
    }

    if (err.code === 11000) {
        statusCode = 409;
    }

    res.status(statusCode).json({

        success: false,

        message: statusCode === 500
            ? "Internal Server Error"
            : err.message

    });

});


// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {

        await connectDB();

        server.listen(PORT, () => {

            console.log(`Server running on port ${PORT}`);

        });

    } catch (error) {

        console.error("Server startup failed:", error.message);

        process.exit(1);

    }

};


startServer();