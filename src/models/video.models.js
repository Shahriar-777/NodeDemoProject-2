import mongoose, { Schema, model } from "mongoose";

const videoSchema = new mongoose.Schema({

    videoFile: {
        type: String,
        require: [true, "video is required"]
    },

    thumbnail: {
        type: String,
        require: [true, "thumbnail is required"]
    },

    title: {
        type: String,
        require: [true, "title is required"]
    },
    description:{
        type:String,
        require:[true,"description are required"]
       },
    duration:{
        type:Number,   //cloudinary
        require:true
    },

    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
           type:Schema.Types.ObjectId,
           ref:"User"
    }


}, { timestamps: true });


export default Video = mongoose.model("Video", videoSchema);