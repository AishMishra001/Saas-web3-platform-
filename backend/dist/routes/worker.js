"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const __1 = require("..");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const workerMiddleware_1 = require("../middlewares/workerMiddleware");
const prismaClient = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get("/nextTask", workerMiddleware_1.workerMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore 
    const userId = req.userId;
    const task = yield prismaClient.task.findFirst({
        where: {
            done: false,
            submissions: {
                none: {
                    worker_id: userId,
                }
            }
        },
        select: {
            options: true,
            title: true
        }
    });
    if (!task) {
        res.status(411).json({
            message: "No more task left for you to review"
        });
    }
    else {
        res.status(411).json({
            task
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hardcodedWalletAddress = "3hbguPSt9QwiB9gnYzGDbjL4q4Hsr4xGyHQj8Cqmzx9Ea";
        const existingUser = yield prismaClient.worker.findFirst({
            where: {
                address: hardcodedWalletAddress
            }
        });
        if (existingUser) {
            const token = jsonwebtoken_1.default.sign({
                userId: existingUser.id
            }, __1.WORKER_JWT_SECRET);
            res.json({
                token
            });
        }
        else {
            const user = yield prismaClient.worker.create({
                data: {
                    address: hardcodedWalletAddress,
                    pending_amount: 0,
                    locked_amount: 0
                }
            });
            const token = jsonwebtoken_1.default.sign({
                userId: user.id
            }, __1.JWT_SECRET);
            res.json({
                token
            });
        }
    }
    catch (err) {
        console.error(err);
    }
}));
module.exports = router;
