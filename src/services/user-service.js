const {StatusCodes} = require('http-status-codes');

const { UserRepository,RoleRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {User} = require('../models');

const useBcrypt = require('sequelize-bcrypt');

const { ServerConfig } = require('../config')

var jwt = require('jsonwebtoken');
const {Role_enum} = require('../utils/enums');

const userRepository = new UserRepository();

const roleRepository = new RoleRepository();


async function createUser(data) {
    try {
        const user = await userRepository.create(data);
        const customerRole = await roleRepository.getRoleByName(Role_enum.CUSTOMER);
        await user.addRole(customerRole);
        return user;
    } catch(error) {
        console.log(error);
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new User object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function signin(data) {
    try {
        const user = await userRepository.findOne({email:data.email});
        if (!user) {
            throw new AppError(['user not found with this email'],StatusCodes.NOT_FOUND);
        }
         console.log(data.password);
         
        if (user.authenticate(data.password)) {
            var token = jwt.sign( data, ServerConfig.JWT_SECRET, { expiresIn: ServerConfig.JWT_EXPIRY });
            return {token: token};
        }
        else{ 
            throw new AppError(['Wrong password'],StatusCodes.BAD_REQUEST);
        }


    } catch(error) {
        console.log(error);
        
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Cannot validate the user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function isAuthenticated(token) {
    try {
        var decoded = jwt.verify(token, ServerConfig.JWT_SECRET);
        const user = await userRepository.findOne({email:decoded.email});
        console.log(decoded);
        if (!user) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }
        console.log(user);
        return user.id;
    } catch (error) {
        console.log(error.name);
        if(error.name == 'JsonWebTokenError'){
            throw new AppError(['invalid jwt token'],StatusCodes.BAD_REQUEST);
        }
        if (error.name == 'TokenExpiredError') {
            throw new AppError(['jwt token expired'],StatusCodes.BAD_REQUEST);
        }
        if(error instanceof AppError) throw error;
        throw new AppError(['can\'t authenticate the jwt token'], StatusCodes.INTERNAL_SERVER_ERROR);
    }
}




module.exports = {
    createUser,
    signin,
    isAuthenticated
}