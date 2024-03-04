import asyncHandler from "../utils/asyncHandler.js";
import customError from "../utils/customError.js";
import jwt  from "jsonwebtoken";
import User from '../models/user.models.js';
 const verifyJWT=asyncHandler(async( req,_,next)=>{  //no use res parameter that's why  change to _

    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token)
        {
            const error=new customError("UnAuthorized Request",401);
            next(error);
        }
       
        //decoded Token
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        
    
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
        if(!user)
        {
            const error=new customError("Invalid Access Token",401);
            next(error);
        }
    
        req.user=user;
    
        next();
    }
     catch (error) {
        next(error);
    }
})

export default verifyJWT;