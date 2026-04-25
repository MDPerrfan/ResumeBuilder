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

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/resume", resumeRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  if (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
  return next();
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
