import { Router } from "express";
import { JWT_SECRET, WORKER_JWT_SECRET } from "..";
import { PrismaClient } from "@prisma/client";
import  jwt from "jsonwebtoken";
import { workerMiddleware } from "../middlewares/workerMiddleware";
import { getNextTask } from "../db";
import { createSubmissionInput } from "../types";
import { Request , Response } from "express";
import { TOTAL_DECIMALS } from "./config";

const TOTAL_SUBMISSIONS = 100  ; 

const prismaClient = new PrismaClient() ; 

const router = Router() ; 

router.post("/payout" , workerMiddleware , async(req : Request ,res : Response ) : Promise<void>=>{
  // @ts-ignore 
  const userId : string = req.userId ; 
  const worker = await prismaClient.worker.findFirst({
    where : {
      id : Number(userId)
    }
  })

  if(!worker){
   res.status(403).json({
      message : "User not Found"
    })

    return ; 
  }

  //logic here to crete a tx 
  const txnId = "1cx34535"

  await prismaClient.$transaction(async tx=>{
    await tx.worker.update({
      where : {
        id : Number(userId)
      },
      data : {
          pending_amount : {
              decrement : worker.pending_amount 
          } , 
          locked_amount : {
              increment : worker.locked_amount 
          }
      }
    })

    await tx.payout.create({
      data:{
        user_id : Number(userId) , 
        amount : worker.pending_amount , 
        status : "Processing" , 
        signature : txnId 
      }
    })
  })

  res.json({
    message : "Processing payout" , 
    amount : worker.pending_amount 
  })

})

router.post("/submission" , workerMiddleware , async (req : Request ,res : Response ) : Promise<void> => {
  // @ts-ignore 
  const userId  = req.userId  
  const body   = req.body  

  const bodyParse = createSubmissionInput.safeParse(body)

  if(bodyParse.success){
    const task = await getNextTask(Number(userId)) ; 
    if(!task || task?.id !== Number(bodyParse.data.taskId)){
       res.status(411).json({
        message : "Incorrect task id"
      })

      return ; 
    }

    const amount = (Number(task.amount) / TOTAL_SUBMISSIONS).toString()


    const submission = await prismaClient.$transaction(async tx=>{

      const submission = await tx.submission.create({
        data : {
          option_id : Number(bodyParse.data?.selection) , 
          worker_id : userId , 
          task_id : Number(bodyParse.data?.taskId) , 
          amount 
        }
      })


      await tx.worker.update({
        where : {
          id: userId ,
        } , 
        data : {
          pending_amount : {
            increment : Number(amount)
          }
        }
      })

      return submission ; 
    })

    


    const nextTask = await getNextTask(Number(userId)) ; 
    res.json({
      nextTask , 
      amount 
       })
  }

})



router.get("/nextTask" , workerMiddleware , async(req,res)=>{
  // @ts-ignore 
  const userId = req.userId ; 
  
  const task = await getNextTask(Number(userId)) ; 

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