const { StatusCodes } = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');

async function checkAuth(req, res, next) {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            throw new AppError(['x-access-token is missing in the incomeing request in the correct form'],StatusCodes.BAD_REQUEST);
        }
        const response =await UserService.isAuthenticated(token);
    if (response) {
        req.user = response;
        console.log('response', response);
        next();
    }
    console.log(response);
    } catch (error) {
        ErrorResponse.error = error;
        return res
        .status(error.statusCode)
        .json(ErrorResponse);
    }
   
}

module.exports={
    
    checkAuth
}