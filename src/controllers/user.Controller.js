import  asyncHandler from '../utils/asyncHandler.js'
import customError from '../utils/customError.js';
import User from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser=asyncHandler(async (req,res,next)=>{

     //get user details from frontend
     const {fullname,email,username,password}=req.body;
     if([fullname,email,username,password].some(filed=>filed?.trim()===""))
     {
        const error=new customError('All fileds are required',404);
        next(error);
     }

     //check user all ready exites 
     const existedUser=await User.findOne({$or:[{username},{email}]})

     if(existedUser)
     {
      const error=new customError('user All ready exites',409);
        next(error);
     }

   //check for image and avater

   
   const avaterLocalPath=req.files?.avatar[0]?.path;
   const coverImageLocalPath=req.files?.coverImage[0]?.path;
   


   if(!avaterLocalPath)
   {
      const error=new customError('Avater file required',400);
        next(error);
   }

   //upload to cloudinary
   const avater=await uploadOnCloudinary(avaterLocalPath);
   const coverImage=await uploadOnCloudinary(coverImageLocalPath);

   if(!avater)
   {
      const error=new customError('Avater are required',400);
        next(error);
   }

   //create user in database
   const  user=await User.create({
      username,
      email,
      fullname,
      avatar:avater.url,
      coverImage:coverImage?.url||"",
      password,
      
   });

   // response data to client
   const creatUser=await User.findById(user._id).select("-password -refreshToken");
 
    
   if(!creatUser)
   { 
      const error=new customError('internal mongoose error user not create',500);
      next(error);
   }


  res.status(201).json(
   new apiResponse(200,creatUser,"User Register Successfully")
  )

})


export {registerUser};