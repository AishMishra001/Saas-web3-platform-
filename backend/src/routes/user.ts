import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken" ; 
const JWT_SECRET = "Madhav" ; 

const router = Router() ; 

const prismaClient = new PrismaClient() ; 

router.post("/signin" , async (req,res)=>{
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
})

module.exports =  router ; 