import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import { getCustomers,registration } from './controllers/user.controllers.js';

dotenv.config()

console.log("APP ", process.env.CORS_ORIGIN);

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb" 
}))

app.use(express.urlencoded({
    extended: true, limit: "16kb"
}))

app.use(express.static("public")) //For any other files like images etc, same name folder must be created in root dir

app.use(cookieParser()) 

// -------------------------------------------------------------------------------------------------------------------------------------

import { userRouter } from './routers/user.routes.js';

app.use('/api/v1/users',userRouter)

export {app}