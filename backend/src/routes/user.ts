import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken" ; 

import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { JWT_SECRET } from "..";
import { authMiddleware } from "../middlewares/authMiddleware";

const s3Client = new S3Client({
  credentials : {
    accessKeyId : "AKIATQPD64VWLGZBWZMX" , 
    secretAccessKey : "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"
  } , 
  region : "ap-south-1"
})
const router = Router() ; 

const prismaClient = new PrismaClient() ; 

router.get("/presignedUrl", authMiddleware ,  async(req,res)=>{
  //  @ts-ignore 
  const userId = req.userId ; 
const command = new PutObjectCommand({
  Bucket: "labelchain",
  Key: `${userId}/${Math.random()}/image.jpg`,
  ContentType : "img/jpg"
})

const preSignedUrl = await getSignedUrl(s3Client, command, {
  expiresIn: 3600
})

console.log(preSignedUrl) ; 


res.json({
  preSignedUrl 
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