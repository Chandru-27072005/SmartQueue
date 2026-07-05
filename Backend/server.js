require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
console.log(__dirname);
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    console.log("HOME ROUTE HIT");
    res.send("Welcome to Smart Queue Backend");
});

// Booking Routes
app.use("/api/bookings", bookingRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});