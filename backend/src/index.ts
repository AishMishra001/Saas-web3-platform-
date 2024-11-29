const express = require("express") ; 
const userRouter = require("./routes/user") ; 
const workerRouter = require("./routes/worker") ;  
const app = express() ; 
export const JWT_SECRET = "Madhav" ; 
export const WORKER_JWT_SECRET = JWT_SECRET + "worker" ; 
import cors from "cors"
// postgres + prisma ( url in aws.txt locally ) 

app.use(express.json()) ; 
app.use(cors())
app.use("/v1/user", userRouter) ; 
app.use("/v1/worker",workerRouter) ;  


app.listen(3000) ; 
// export default something ----> import something from "path" 

// module.export = something ----> const something = require("path") ; 