import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import router from "./routes";

const app = express();

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MongoDB URL is not defined!");
  }

  await mongoose.connect(mongoURI);
  console.log("Connected Database");
};

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : "*";
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "HRMS API is running" });
});

app.use("/v1/api/", router);

export { app, connectDB };
export default app;
