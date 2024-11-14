import { Router } from "express";
<<<<<<< HEAD
import { bookSearch, viewBook, newBook, buy } from '../controllers/books.controllers.js';
=======
import { bookSearch, viewBook, newBook, recommend, updateBook } from '../controllers/books.controllers.js';
>>>>>>> 530dde923b87f58456fdd6edaa1131419fafbcdd
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { isLogin, checkVendor } from "../middlewares/auth.middlewares.js";

const booksRouter = Router()

booksRouter.route('/').get(isLogin, asyncHandler( async (req,res) => {
    console.log("Book search")
    bookSearch(req, res);
} ) )

booksRouter.route('/new').post(checkVendor, asyncHandler( async (req,res) => {
    newBook(req, res);
} ) )

booksRouter.route('/recommend').get(isLogin, asyncHandler( async (req,res) => {
    recommend(req, res);
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
booksRouter.route('/:id').put( asyncHandler( async (req,res) => {
    updateBook(req, res);
} ) )

export { booksRouter }