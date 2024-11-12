import { Router } from "express";
import { bookSearch } from '../controllers/books.controllers.js';
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { isLogin } from "../middlewares/auth.middlewares.js";

const booksRouter = Router()

booksRouter.route('/').get(isLogin, asyncHandler( async (req,res) => {
    bookSearch(req, res);
} ) )

export { booksRouter }