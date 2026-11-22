const { io } = require("socket.io-client");

const token = process.env.JWT_TOKEN;

if (!token) {
    throw new Error("Set JWT_TOKEN before running this socket test.");
}

const socket = io("http://localhost:5000", {
    auth: {
        token: token
    }
});

// Connection successful
socket.on("connect", () => {
    console.log("Connected to server!");

    // Send message
    socket.emit("chat:message", {
        message: "Hello! Testing Socket.IO in Lab 4."
    });
});

// Receive message
socket.on("chat:message", (data) => {
    console.log("New Message:", data);
});

// Error handling
socket.on("connect_error", (error) => {
    console.log("Connection Error:", error.message);
});

// Disconnect
socket.on("disconnect", () => {
    console.log("Disconnected from server");
});