import { Router } from "express";
import { bookSearch } from '../controllers/books.controllers.js';
import { asyncHandler } from "../utils/asyncHandler.utils.js";

const booksRouter = Router()

booksRouter.route('/').get( asyncHandler( async (req,res) => {
    bookSearch(req, res);
} ) )

export { booksRouter }