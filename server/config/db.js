const mongoose = require("mongoose");

const connectDB = async () => {

  try {
    mongoose.connection.on("connected",()=>{console.log("Database Connected")})

    let mongoUri = process.env.MONGO_URI;

    const projectName = 'resume-builder'

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    if (mongoUri.endsWith('/')) {
      mongoUri = mongoUri.slice(0, -1)
    }

    await mongoose.connect(`${mongoUri}/${projectName}`);
  } catch (error) {
    console.error("Failed to connect MongoDB", error)
  }

};

module.exports = connectDB;
