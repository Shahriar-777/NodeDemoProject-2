export default (error,req,res,next)=>{
    error.statusCode=error.statusCode || 500;
    error.status=error.status ||'error';
    return res.status(error.statusCode).json({
        status:statusCode,
        message:error.message
    })
}