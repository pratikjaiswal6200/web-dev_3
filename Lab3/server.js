require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();


// Middleware
app.use(express.json());


// Home Route
app.get("/", (req, res) => {
    res.send("Inventory Management System API is Running!");
});


// Product Routes
app.use("/api/products", productRoutes);


// Error Handling Middleware
app.use(errorHandler);


// Start Server
const startServer = async () => {
    try {

        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();