import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './controllers/error.Controller.js';
import customError from './utils/customError.js';
const app=express();

app.use(cors({origin:process.env.CORS_ORIGIN,credentials:true}));

app.use(express.json({limit:'20kg'}));
app.use(urlencoded({limit:'20kb',extended:true}));
app.use(express.static("public"));
app.use(cookieParser());



//routes import 
import userRouter from './routes/user.Routes.js';

//routes decleration

app.use('/api/v1/users',userRouter);


//route error handel

app.use('*',(req,res,next)=>{

    const error=new customError("can't find this url",404);
    next(error);
})

app.use(globalErrorHandler);
export default app;