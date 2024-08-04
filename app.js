import express from "express"

import { config } from 'dotenv';
config({ path: './.env' });

import cors from "cors"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import { dbConnection } from "./dbConnection/DbConnection.js"

import userRouter from "./router/userRouter.js"
import messageRouter from "./router/messageRouter.js"
import appointmentRouter from "./router/appointmentRouter.js"
import paymentRouter from "./router/paymentRouter.js"

import { errorMiddleware } from "./middleware/errorMiddleware.js";
import morgan from "morgan";

const app=express()
app.use(morgan("common"))
app.use(cors({
    origin:[process.env.FRONTEND_URL,process.env.DASHBOARD_URL]
    ,methods:["GET","POST","PUT","DELETE"]
    ,credentials:true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

app.use("/api/v1/message",messageRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/appointment",appointmentRouter)
app.use("/api/v1/payment",paymentRouter)


dbConnection()
//

app.use(errorMiddleware)//use this in the end always
export default app