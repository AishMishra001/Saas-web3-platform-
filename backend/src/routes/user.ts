import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken" ; 

import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { JWT_SECRET } from "..";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

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


router.post("/task" , authMiddleware , async(req,res)=>{
  
})

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
    const hardcodedWalletAddress = "3hbguPSt9QwiB9gnYzGDbjL4q4Hsr4xGyHQj8Cqmzx9E" ; 

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