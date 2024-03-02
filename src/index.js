import dotenv from 'dotenv';
import connectDB from './db/DbConnect.js';
import app from './app.js';
//env configuration
dotenv.config({path:'./.env'});



connectDB()
.then(()=>{
    app.listen(process.env.PORT||8080,()=>{console.log(`server is runing at port ${process.env.PORT}`)});
})
.catch((error)=>{
console.log("MongoDB Connection Failed",error);
})

