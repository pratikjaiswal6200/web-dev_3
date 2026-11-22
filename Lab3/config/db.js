const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI is required. Copy .env.example to .env and configure your MongoDB connection string.");
        }

        await mongoose.connect(mongoUri);

        console.log("MongoDB Connected Successfully!");
        console.log("Database: InventoryDB");

    } catch (error) {
        console.log("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;