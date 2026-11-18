"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
exports.app = app;
const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        throw new Error("MongoDB URL is not defined!");
    }
    await mongoose_1.default.connect(mongoURI);
    console.log("Connected Database");
};
exports.connectDB = connectDB;
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
    : "*";
app.use((0, cors_1.default)({ origin: allowedOrigins }));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "HRMS API is running" });
});
app.use("/v1/api/", routes_1.default);
exports.default = app;
