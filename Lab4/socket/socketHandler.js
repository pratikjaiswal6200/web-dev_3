const jwt = require("jsonwebtoken");

const User = require("../models/User");

const appEvents = require("../events/eventEmitter");

const socketHandler = (io) => {

    // Authenticate Socket Connection
    io.use(async (socket, next) => {

        try {

            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication required"));
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(decoded.id)
                .select("name role");

            if (!user) {
                return next(new Error("User not found"));
            }

            socket.user = {
                id: decoded.id,
                name: user.name,
                role: user.role
            };

            next();

        } catch (error) {

            next(new Error("Invalid or expired token"));

        }

    });


    // Socket Connection
    io.on("connection", (socket) => {

        console.log(socket.user.name, "connected");

        
        // Receive Chat Message
        socket.on("chat:message", (payload) => {

            const message = typeof payload === "string"
                ? payload
                : payload?.message;

            if (typeof message !== "string" || !message.trim()) {

                return socket.emit("chat:error", {
                    message: "Message cannot be empty"
                });

            }

            const chatData = {

                userId: socket.user.id,

                name: socket.user.name,

                message: message.trim(),

                sentAt: new Date().toISOString()

            };


            // Emit Event
            appEvents.emit("chat:message", chatData);


            // Broadcast Message
            io.emit("chat:message", chatData);

        });


        // Disconnect
        socket.on("disconnect", () => {

            console.log(socket.user.name, "disconnected");

        });

    });

};


module.exports = socketHandler;