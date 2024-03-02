import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './controllers/error.Controller.js';
const app=express();

app.use(cors({origin:process.env.CORS_ORIGIN,credentials:true}));

app.use(express.json({limit:'20kg'}));
app.use(urlencoded({limit:'20kb',extended:true}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(globalErrorHandler);

export default app;