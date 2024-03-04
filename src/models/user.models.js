import mongoose, { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema=new mongoose.Schema({

    username:{
        type:String,
        require:[true,"username is required"],
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        require:[true,"email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    fullname:{
        type:String,
        require:[true,"name is required"],
        trim:true,
        index:true
    },
    avatar:{
        type:String,   //cloudinary
        require:[true,"image is required"],
    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:'video'
        }
    ],
    password:{
        type:String,
        require:[true,"password is required"]
    },

    refreshToken:{
        type:String
    }

},{timestamps:true});


//Pre password hash

userSchema.pre('save',async function(next){

    if(!this.isModified('password'))
    {
        next();
    }

    this.password=await bcrypt.hash(this.password,10);
    next();
})


//compare password isCorrect
userSchema.methods.isPasswordCorrect=async function(password)
{
    return await bcrypt.compare(password,this.password);
}

//generateAccessToken
userSchema.methods.generateAccessToken=async function()
{
    return  jwt.sign(
        {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


//generateRefreshToken
userSchema.methods.generateRefreshToken=async function()
{
    return  jwt.sign(
        {
        _id:this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


 const User=mongoose.model("User",userSchema);
 export default User;