import { Router } from "express";
import { vendor_delete, getVendors } from '../controllers/admin.controllers.js';
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { checkAdmin } from "../middlewares/auth.middlewares.js";

const adminRouter = Router()

adminRouter.route('/vendors').get(checkAdmin, async (req, res) => {
    console.log("In /vendors")
    getVendors(req, res)
} )

adminRouter.route('/delete/:username').delete(checkAdmin, async (req, res) => {
    vendor_delete(req, res)
} )

export { adminRouter }