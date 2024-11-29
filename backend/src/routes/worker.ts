import { Router } from "express";
import { JWT_SECRET, WORKER_JWT_SECRET } from "..";
import { PrismaClient } from "@prisma/client";
import  jwt from "jsonwebtoken";
import { workerMiddleware } from "../middlewares/workerMiddleware";

const prismaClient = new PrismaClient() ; 

const router = Router() ; 



router.get("/nextTask" , workerMiddleware , async(req,res)=>{
  // @ts-ignore 
  const userId = req.userId ; 
  
  const task = await prismaClient.task.findFirst({
    where : {
      done : false , 
      submissions : {
        none : {
          worker_id : userId ,
         }
       }
    } , 
    select : {
      title : true ,
      options : true 
    }
  })

  if(!task ){
      res.status(411).json({
        message : "No more task left for you to review"
      })
  }else{
    res.status(411).json({
      task
    })
  }
})

router.post("/signin" , async(req,res)=>{
  try{
    const hardcodedWalletAddress = "3hbguPSt9QwiB9gnYzGDbjL4q4Hsr4xGyHQj8Cqmzx9Ea" 
    ; 

    const existingUser = await prismaClient.worker.findFirst({
      where : {
        address : hardcodedWalletAddress  
      }
    })

    if(existingUser){
      const token = jwt.sign({
          userId : existingUser.id  
       } , WORKER_JWT_SECRET)

       res.json(
        {
          token 
        }
       )
    }     else{
      const user = await prismaClient.worker.create({
        data : {
            address : hardcodedWalletAddress , 
            pending_amount : 0 , 
            locked_amount : 0 
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
    
}
)

module.exports = router ; 