"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerMiddleware = void 0;
const __1 = require("..");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function workerMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({ message: "Authorization header missing" });
        return; // End the function to avoid falling through
    }
    const token = authHeader.split(" ")[1]; // Extract the token after 'Bearer'
    if (!token) {
        res.status(401).json({ message: "Malformed authorization header" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, __1.WORKER_JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId; // Attach userId
            next(); // Proceed to next middleware
        }
        else {
            res.status(403).json({ message: "You are not logged in" });
        }
    }
    catch (e) {
        res.status(403).json({ message: "Invalid token" });
    }
}
exports.workerMiddleware = workerMiddleware;
