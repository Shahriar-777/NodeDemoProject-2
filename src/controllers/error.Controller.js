export default (error,req,res,next)=>{
    error.statuCode=error.statuCode || 500;
    error.status=error.status ||'error';
    res.status(error.statuCode).json({
        status:statuCode,
        mesage:error.mesage
    })
}