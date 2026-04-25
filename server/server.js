const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { clerkMiddleware } = require("@clerk/express");
const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Change cors to allow any origin or your specific production URL
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "x-guest-id", "x-temp-user-id"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(clerkMiddleware());

app.get("/", (req, res) => res.json({ status: "API is running" }));

app.use("/api/resume", resumeRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  });