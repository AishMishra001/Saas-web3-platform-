import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken" ; 

import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { JWT_SECRET } from "..";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { createTaskInput } from "../types";
import { TOTAL_DECIMALS } from "./config";
import { Request, Response } from 'express'; 
import { optional } from "zod";
const DEFAULT_TITLE = "Select the most clickable one" ; 

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new Error("AWS credentials are not set in environment variables.");
}

const s3Client = new S3Client({
  credentials: {
    accessKeyId, 
    secretAccessKey,
  },
  region: "ap-south-1",
});

const router = Router() ; 

const prismaClient = new PrismaClient() ; 


router.get("/task", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  // @ts-ignore 
  const taskId: string = req.query.taskId; 
  // @ts-ignore 
  const userId: string = req.userId;

  const taskDetails = await prismaClient.task.findFirst({
    where: {
      user_id: Number(userId),
      id: Number(taskId),
    }, 
    include : {
      options : true 
    }
  });

  if (!taskDetails) {
    res.status(411).json({
      message: "You don't have access to this task",
    });
    return; 
  }
  // Fetching responses
  const responses = await prismaClient.submission.findMany({
    where: {
      task_id: Number(taskId),
    },
    include: {
      option: true,
    },
  });

  const result: Record<string, { count: number, option : { imageUrl: string } }> = {};

  taskDetails.options.forEach( option =>{
    result[option.id] = {
      count: 0,
      option : {
        imageUrl: option.image_url 
      },
    };
  })

  responses.forEach((r) => {
      result[r.option_id].count++;
  });

  // Responding with the result
  res.json({ result });
});

// @ts-ignore 
router.post("/task" , authMiddleware ,(async (req,res)=>{  
  // @ts-ignore 
  const userId = req.userId  ; 
  const body = req.body ; 

  const parseData = createTaskInput.safeParse(body) ; 

  if(!parseData.success){
    return res.status(411).json({
      message : "You are sending the wrong inputs "
    })
  }

  // parse the signature here to ensure the person is paid 

  let response = await prismaClient.$transaction(async tx => {

    const response = await tx.task.create({
        data: {
            title: parseData.data.title ?? DEFAULT_TITLE,
            amount: "1" ,
            //TODO: Signature should be unique in the table else people can reuse a signature
            signature: parseData.data.signature,
            user_id: userId
        }
    });

    await tx.option.createMany({
        data: parseData.data.options.map(x => ({
            image_url: x.imageUrl,
            task_id: response.id
        }))
    })

    return response ; 

})

   res.json({
     id : response.id 
   })
}) )



router.get("/presignedUrl", authMiddleware ,  async(req,res)=>{
  //  @ts-ignore 
  const userId = req.userId ; 

const { url, fields } = await createPresignedPost(s3Client, {
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
})

console.log({url , fields })



res.json({
  preSignedUrl : url , 
  fields 
})

})

router.post("/signin" , async (req,res)=>{
  try{
    const hardcodedWalletAddress = "3hbguPSt9QwiB9gnYzGDbjL4q4Hsr4xGyHQj8Cqmzx9E" 
    ; 

    const existingUser = await prismaClient.user.findFirst({
      where : {
        address : hardcodedWalletAddress  
      }
    })

    if(existingUser){
      const token = jwt.sign({
          userId : existingUser.id  
       } , JWT_SECRET)

       res.json(
        {
          token 
        }
       )
    }     else{
      const user = await prismaClient.user.create({
        data : {
            address : hardcodedWalletAddress , 
        }
      })

      const token = jwt.sign({
        userId : user.id 
      } , JWT_SECRET)

      res.json(
        {
          token 
        }
      )
    }
  }catch(err){
        console.error(err) ; 
  }
    
})

module.exports =  router ; 