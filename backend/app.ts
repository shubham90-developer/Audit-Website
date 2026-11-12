import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import cors from "cors";
dotenv.config();

import router from "./routes";

const app = express();

const DBConnection = async (): Promise<void> => {
  try {
    const MongoURI = process.env.MONGODB_URI;

    if (!MongoURI) {
      throw new Error("⚠ MongoDB URL is not defined!");
    }

    await mongoose.connect(MongoURI);

    console.log("Connected Database");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
DBConnection();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : "*";
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "HRMS API is running" });
});

app.use("/v1/api/", router);

export default app;
