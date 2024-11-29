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
const db_1 = require("../db");
const types_1 = require("../types");
const TOTAL_SUBMISSIONS = 100;
const prismaClient = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.post("/payout", workerMiddleware_1.workerMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore 
    const userId = req.userId;
    const worker = yield prismaClient.worker.findFirst({
        where: {
            id: Number(userId)
        }
    });
    if (!worker) {
        res.status(403).json({
            message: "User not Found"
        });
        return;
    }
    //logic here to crete a tx 
    const txnId = "1cx34535";
    yield prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.worker.update({
            where: {
                id: Number(userId)
            },
            data: {
                pending_amount: {
                    decrement: worker.pending_amount
                },
                locked_amount: {
                    increment: worker.locked_amount
                }
            }
        });
        yield tx.payout.create({
            data: {
                user_id: Number(userId),
                amount: worker.pending_amount,
                status: "Processing",
                signature: txnId
            }
        });
    }));
    res.json({
        message: "Processing payout",
        amount: worker.pending_amount
    });
}));
router.post("/submission", workerMiddleware_1.workerMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore 
    const userId = req.userId;
    const body = req.body;
    const bodyParse = types_1.createSubmissionInput.safeParse(body);
    if (bodyParse.success) {
        const task = yield (0, db_1.getNextTask)(Number(userId));
        if (!task || (task === null || task === void 0 ? void 0 : task.id) !== Number(bodyParse.data.taskId)) {
            res.status(411).json({
                message: "Incorrect task id"
            });
            return;
        }
        const amount = (Number(task.amount) / TOTAL_SUBMISSIONS).toString();
        const submission = yield prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const submission = yield tx.submission.create({
                data: {
                    option_id: Number((_a = bodyParse.data) === null || _a === void 0 ? void 0 : _a.selection),
                    worker_id: userId,
                    task_id: Number((_b = bodyParse.data) === null || _b === void 0 ? void 0 : _b.taskId),
                    amount
                }
            });
            yield tx.worker.update({
                where: {
                    id: userId,
                },
                data: {
                    pending_amount: {
                        increment: Number(amount)
                    }
                }
            });
            return submission;
        }));
        const nextTask = yield (0, db_1.getNextTask)(Number(userId));
        res.json({
            nextTask,
            amount
        });
    }
}));
router.get("/nextTask", workerMiddleware_1.workerMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore 
    const userId = req.userId;
    const task = yield (0, db_1.getNextTask)(Number(userId));
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
