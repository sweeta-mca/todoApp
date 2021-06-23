
function errorHandler(err,req,res,next){
    res.json({
        success : false,
        statusCode:err.code,
        message :err.message
    });
}

module.exports = errorHandler;