"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminToken = exports.signAdminToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET must be set and at least 32 characters long");
    }
    return secret;
};
const signAdminToken = (payload) => {
    const options = {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? "1d"),
        algorithm: "HS256",
    };
    return jsonwebtoken_1.default.sign(payload, getSecret(), options);
};
exports.signAdminToken = signAdminToken;
const verifyAdminToken = (token) => jsonwebtoken_1.default.verify(token, getSecret(), { algorithms: ["HS256"] });
exports.verifyAdminToken = verifyAdminToken;
