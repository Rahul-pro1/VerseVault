import { Router } from "express";
import { bookSearch, viewBook, newBook, buy } from '../controllers/books.controllers.js';
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { isLogin, checkVendor } from "../middlewares/auth.middlewares.js";

const booksRouter = Router()

booksRouter.route('/').get(isLogin, asyncHandler( async (req,res) => {
    bookSearch(req, res);
} ) )

booksRouter.route('/:id').get( asyncHandler( async (req,res) => {
    viewBook(req, res);
} ) )

booksRouter.route('/new').post(isLogin, checkVendor, asyncHandler( async (req,res) => {
    newBook(req, res);
} ) )

booksRouter.route('/buy').post(isLogin, asyncHandler( async (req,res) => {
    buy(req,res)
} ))

export { booksRouter }