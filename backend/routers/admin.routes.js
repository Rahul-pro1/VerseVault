import { Router } from "express";
import { vendor_delete, getVendors } from '../controllers/admin.controllers.js';
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { checkAdmin } from "../middlewares/auth.middlewares.js";

const adminRouter = Router()

adminRouter.route('/delete/:username').delete(checkAdmin, asyncHandler( (req, res) => {
    vendor_delete(req, res)
} ) )

adminRouter.route('/vendors').get(checkAdmin, asyncHandler( (req, res) => {
    console.log("In /vendors")
    getVendors(req, res)
} ))

export { adminRouter }