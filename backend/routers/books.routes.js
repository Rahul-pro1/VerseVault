import { Router } from "express";
import { bookSearch, viewBook, newBook } from '../controllers/books.controllers.js';
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { isLogin } from "../middlewares/auth.middlewares.js";

const booksRouter = Router()

booksRouter.route('/').get(isLogin, asyncHandler( async (req,res) => {
    bookSearch(req, res);
} ) )

booksRouter.route('/:id').get( asyncHandler( async (req,res) => {
    viewBook(req, res);
} ) )

// booksRouter.route('/new').post(checkVendor, asyncHandler( async (req,res) => {
//     newBook(req, res);
// } ) )

export { booksRouter }