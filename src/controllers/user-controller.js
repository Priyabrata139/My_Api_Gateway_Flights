const { StatusCodes } = require('http-status-codes');

const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

/**
 * POST : /signup 
 * req-body {email: 'priya@gmail.com', password: 33333}
 */
async function signup(req, res) {
    try {
        const user = await UserService.createUser({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}


/**
 * POST : /signup 
 * req-body {email: 'priya@gmail.com', password: 33333}
 */
async function signin(req, res) {
    try {
        const user = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function addUserRole(req, res) {
    try {
        const response = await UserService.addRole({
            userId: req.body.userId,
            role: req.body.role
        });
        SuccessResponse.data = response;
        
        return res.
                  status(StatusCodes.ACCEPTED)
                  .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.
        status(error.statusCode)
        .json(ErrorResponse);
    }
}


module.exports= {
    signup,
    signin,
    addUserRole
}