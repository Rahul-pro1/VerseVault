import { asyncHandler } from "../utils/asyncHandler.utils.js";

const isLogin = asyncHandler( async (req,res,next) => {

    if(req.session && req.session.user){
        return next()
    }
    else{
        console.log(`User not logged in!`);
        return res.status(401).json({"message":`User not logged in!`})
    }
} )

export {isLogin}