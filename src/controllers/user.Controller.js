import  asyncHandler from '../utils/asyncHandler.js'
import customError from '../utils/customError.js';
import User from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

//generateAccessAndRefereshToken
const generateAccessAndRefereshToken=async (userId)=>{
     try{
           const user=await User.findById(userId);
           const accessToken=await user.generateAccessToken();
           const refreshToken=await user.generateRefreshToken();

           user.refreshToken=refreshToken;
           await user.save({ validateBeforeSave: false })

           return {accessToken,refreshToken};
     }
     catch(error)
     {
        console.log("something went wrong while generate access token and refresh token");
     }
}



//register user Controller

const registerUser=asyncHandler(async (req,res,next)=>{

     //get user details from frontend
     const {fullname,email,username,password}=req.body;
     if (!fullname || !email || !username || !password) 
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
   //const coverImageLocalPath=req.files?.coverImage[0]?.path;
   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0)
   {
      coverImageLocalPath=req.files?.coverImage[0]?.path;
   }


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





//user Login Controller

const loginUser=asyncHandler(async(req,res,next)=>{
//req.body   data

const {email,username,password}=req.body;


if(!(email || username))
{
   const error=new customError("All fields are required",401);
   next(error);
}

//find the user

const existedUser=await User.findOne({$or:[{username},{email}]})

   if(!existedUser)
   {
    const error=new customError('user was not register',404);
      next(error);
   }

//password check
  const isPasswordValid= await existedUser.isPasswordCorrect(password);
  
if(!isPasswordValid)
{
   const error=new customError('invalid credentials',404);
      next(error);
}

// access and refresh token

const{accessToken,refreshToken}=await generateAccessAndRefereshToken(existedUser._id);



//update user after generated tokens
const loggedInUser= await User.findById(existedUser._id).select("-password -refreshToken");

//send cookies
const options={
   httpOnly:true,
   secure:true
}



//response

res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json( new apiResponse(200,{loggedInUser,accessToken,refreshToken},"User Register Successfully"))

})




//LogOut

const logoutUser=asyncHandler(async(req,res,next)=>{
//update database 
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )



    //clear cookie
    const options={
      httpOnly:true,
      secure:true
   }

   res.status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json( new apiResponse(200,{},"User LogOut Successfully"))
})

const refreshAccessToken=asyncHandler(async(req,res,next)=>{
         const incomingRefreshToken=req.cookie.refreshToken || req.body.refreshToken;
 
         if(!incomingRefreshToken)
         {
            const error=new customError("Unauthrized request",401);
            next(error);
         }

         const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
          console.log(decodedToken);
         const user=await User.findById(decodedToken?._id);

         if(!user)
         {
            const error=new customError("invalid refresh Token",401);
            next(error);
         }

         if(incomingRefreshToken!==user?.refreshToken)
         {
            const error=new customError("refresh token is expired or used",401);
            next(error);
         }

         const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id);
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )

})


const changeCurrentPassword=asyncHandler(async(req,res,next)=>{
   const {oldPassword,newPassword}=req.body;
   if(!(oldPassword && newPassword))
   {
      const error=new customError("All fileds are required",401);
      next(error);
   }

   const user=await User.findById(req.user?.id);
    
   const  isPasswordCorrect=await user.isPasswordCorrect(oldPassword);
   if(!isPasswordCorrect)
   {
      const error=new customError("Invalid old Password",400);
      next(error);
   }

   user.password=newPassword;

   await user.save({ validateBeforeSave: false })

   return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"))

})



export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword};