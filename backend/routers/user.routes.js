import { Router } from "express";
import { getCustomers,userRegistration } from '../controllers/user.controllers.js';
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { upload } from "../middlewares/multer.middlewares.js";

const userRouter = Router()
// const upload = multer()

userRouter.route('/').get( asyncHandler( async (req,res) => {
    getCustomers(req,res)
} ) )

userRouter.route('/register').post( upload.single("profile"), asyncHandler( async (req,res) => {
    userRegistration(req,res)
} ) )

export {userRouter}