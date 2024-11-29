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
const client_1 = require("@prisma/client");
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_s3_1 = require("@aws-sdk/client-s3");
const __1 = require("..");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const s3_presigned_post_1 = require("@aws-sdk/s3-presigned-post");
const types_1 = require("../types");
const DEFAULT_TITLE = "Select the most clickable one";
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS credentials are not set in environment variables.");
}
const s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region: "ap-south-1",
});
const router = (0, express_1.Router)();
const prismaClient = new client_1.PrismaClient();
router.get("/task", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore 
    const taskId = req.query.taskId;
    // @ts-ignore 
    const userId = req.userId;
    const taskDetails = yield prismaClient.task.findFirst({
        where: {
            user_id: Number(userId),
            id: Number(taskId),
        },
        include: {
            options: true
        }
    });
    if (!taskDetails) {
        res.status(411).json({
            message: "You don't have access to this task",
        });
        return;
    }
    // Fetching responses
    const responses = yield prismaClient.submission.findMany({
        where: {
            task_id: Number(taskId),
        },
        include: {
            option: true,
        },
    });
    const result = {};
    taskDetails.options.forEach(option => {
        result[option.id] = {
            count: 0,
            option: {
                imageUrl: option.image_url
            },
        };
    });
    responses.forEach((r) => {
        result[r.option_id].count++;
    });
    // Responding with the result
    res.json({ result });
}));
// @ts-ignore 
router.post("/task", authMiddleware_1.authMiddleware, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore 
    const userId = req.userId;
    const body = req.body;
    const parseData = types_1.createTaskInput.safeParse(body);
    if (!parseData.success) {
        return res.status(411).json({
            message: "You are sending the wrong inputs "
        });
    }
    // parse the signature here to ensure the person is paid 
    let response = yield prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const response = yield tx.task.create({
            data: {
                title: (_a = parseData.data.title) !== null && _a !== void 0 ? _a : DEFAULT_TITLE,
                amount: "1",
                //TODO: Signature should be unique in the table else people can reuse a signature
                signature: parseData.data.signature,
                user_id: userId
            }
        });
        yield tx.option.createMany({
            data: parseData.data.options.map(x => ({
                image_url: x.imageUrl,
                task_id: response.id
            }))
        });
        return response;
    }));
    res.json({
        id: response.id
    });
})));
router.get("/presignedUrl", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //  @ts-ignore 
    const userId = req.userId;
    const { url, fields } = yield (0, s3_presigned_post_1.createPresignedPost)(s3Client, {
        Bucket: 'labelchain',
        Key: `${userId}/${Math.random()}/image.jpg`,
        Conditions: [
            ['content-length-range', 0, 5 * 1024 * 1024] // 5 MB max
        ],
        Fields: {
            success_action_status: '201',
            'Content-Type': 'image/png'
        },
        Expires: 3600
    });
    console.log({ url, fields });
    res.json({
        preSignedUrl: url,
        fields
    });
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hardcodedWalletAddress = "3hbguPSt9QwiB9gnYzGDbjL4q4Hsr4xGyHQj8Cqmzx9E";
        const existingUser = yield prismaClient.user.findFirst({
            where: {
                address: hardcodedWalletAddress
            }
        });
        if (existingUser) {
            const token = jsonwebtoken_1.default.sign({
                userId: existingUser.id
            }, __1.JWT_SECRET);
            res.json({
                token
            });
        }
        else {
            const user = yield prismaClient.user.create({
                data: {
                    address: hardcodedWalletAddress,
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
