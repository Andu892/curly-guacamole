const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");


dotenv.config(); // Load .env variables

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
console.log("Server started and routes loaded");


// Test route (optional)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global error handler (optional safety)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
