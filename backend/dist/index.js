"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORKER_JWT_SECRET = exports.JWT_SECRET = void 0;
const express = require("express");
const userRouter = require("./routes/user");
const workerRouter = require("./routes/worker");
const app = express();
exports.JWT_SECRET = "Madhav";
exports.WORKER_JWT_SECRET = exports.JWT_SECRET + "worker";
// postgres + prisma ( url in aws.txt locally ) 
app.use(express.json());
app.use("/v1/user", userRouter);
app.use("/v1/worker", workerRouter);
app.listen(3000);
// export default something ----> import something from "path" 
// module.export = something ----> const something = require("path") ; 
