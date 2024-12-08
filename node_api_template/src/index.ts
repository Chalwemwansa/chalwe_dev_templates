import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

// Initialize environment variables from the .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Middleware to parse JSON requests and enable CORS
app.use(cors());

// the status of the server
const STATUS: string | undefined = process.env.STATUS;
console.log(`Server is in ${STATUS} mode`);

// get the status of the server
if (STATUS === "testing") {
  // Serve static files from the "uploads" directory
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
}

//PORT
const PORT: string | undefined = process.env.PORT;

// MongoDB connection setup
const mongoURI: string | undefined = process.env.MONGODB_URI;

if (mongoURI !== undefined) {
  // Connect to MongoDB
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB");
      if (PORT !== undefined) {
        app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
        });
      } else {
        console.log("PORT is undefined in the .env file");
      }
    })
    .catch((err) => console.error("Failed to connect to MongoDB", err));
} else {
  console.log("MONGODB_URI is undefined in the .env file");
}
