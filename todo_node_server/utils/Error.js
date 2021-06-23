class CustomError extends Error{
    constructor(message) {
        super();
        if(this instanceof BadRequestError)
        {
            this.code = 400;
        }
        if(this instanceof InternalServerError)
        {
            this.code = 500;
        }
        
        this.message = message;
    }

}

class InternalServerError extends CustomError{}
class BadRequestError extends CustomError{}
module.exports = {
    CustomError, InternalServerError,BadRequestError
}

