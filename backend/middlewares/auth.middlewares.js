import { pool } from "../index.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

const isLogin = asyncHandler( async (req,res,next) => {

    console.log(`In isLogin middleware`);

    if(req.session && req.session.user){
        console.log(`Logged In!`)
        return next()
    }
    else{
        console.log(`User not logged in!`);
        return res.status(401).json({"message":`User not logged in!`})
    }
} )

const checkAdmin = asyncHandler(async( req,res,next ) => {
    const {username} = req.body

    const [admin] = await pool.query(`select * from admin where admin_username=?`,[username])

    console.log(`admin ${admin[0].admin_username}`);

    return res
    .send(`user ${admin[0].admin_username}`)
} )

const checkVendor = asyncHandler(async( req,res,next ) => {
<<<<<<< HEAD

    console.log(`In checkVendor`);

    if(req.session.role === "vendor"){
        console.log(`Is a vendor`);
        return next()
    }
    else{
        console.log(`Is not a vendor`);
        return res.status(401).json({"message":`User not a vendor!`})
    }

=======
    console.log(`In checkVendor middleware`);

    if(req.session.role === "vendor"){
        return next()
    }
    else{
        console.log(`Not a vendor`);
        return res.status(401).json({"message":`Not a vendor`})
    }
>>>>>>> 530dde923b87f58456fdd6edaa1131419fafbcdd
} )

export {isLogin, checkAdmin, checkVendor}