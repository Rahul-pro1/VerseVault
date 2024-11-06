import { Router } from "express";
import { getCustomers,userLogin,userLogout,userRegistration,shoppingCart } from '../controllers/user.controllers.js';
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { isLogin } from "../middlewares/checkLogin.middlewares.js";

const userRouter = Router()
// const upload = multer()

userRouter.route('/').get( asyncHandler( async (req,res) => {
    getCustomers(req,res)
} ) )

userRouter.route('/register').post( upload.single("profile"), asyncHandler( async (req,res) => {
    userRegistration(req,res)
} ) )

userRouter.route('/login').post( asyncHandler( async (req,res) => {
    userLogin(req,res)
} ) )

userRouter.route('/logout').post( asyncHandler( async (req,res) => {
    userLogout(req,res)
} ) )

userRouter.route('/shopping').post( isLogin, asyncHandler( async (req,res) => {
    shoppingCart(req,res)
} ) )

export {userRouter}