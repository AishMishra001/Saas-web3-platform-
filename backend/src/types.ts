import z, { optional } from "zod" ; 

const createTaskInput = z.object({
  options : z.array(z.object({
    imageUrl : z.string() ,
  })) , 
  title : z.string().optional() 
})