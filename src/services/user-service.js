const {StatusCodes} = require('http-status-codes');

const { UserRepository,RoleRepository, User_RoleRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {User} = require('../models');

const useBcrypt = require('sequelize-bcrypt');

const { ServerConfig } = require('../config')

var jwt = require('jsonwebtoken');

const {Role_enum} = require('../utils/enums');

const userRepository = new UserRepository();

const roleRepository = new RoleRepository();

const user_roleRepository = new User_RoleRepository();

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


async function isAdmin(data) {
    try {
        // const user = userRepository.get(data.user);
        // console.log('data=', data); 
        const userId = data.userId;
        const roleObj = await roleRepository.getRoleByName(Role_enum.ADMIN);
        const roleId = roleObj.id;
        
        const user_role = await user_roleRepository.getUser_role({
            userId,
            roleId
        });
        if (user_role) {
            return true;
        }
        return false;
        
        
    } catch (error) {
        throw new AppError(['something went wrong while admin authoriation'], StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function addRole(data) {
    try {
        const user = await userRepository.get(data.userId);
        if (!user) {
            throw new AppError(['user not found'], StatusCodes.NOT_FOUND);
        }
        const Role = await roleRepository.getRoleByName(data.role);
        if (!Role) {
            throw new AppError([`${data.role} role is not exsist`], StatusCodes.BAD_REQUEST);
        }


        const userId = data.userId;
        const roleObj = await roleRepository.getRoleByName(data.role);
        const roleId = roleObj.id;
        
        const user_role = await user_roleRepository.getUser_role({
            userId,
            roleId
        });
        if (user_role) {
            throw new AppError([`This user is already registered as ${data.role}`], StatusCodes.BAD_REQUEST);
        }

        const response = await user.addRole(Role);

        return response;

    } catch (error) {
        if (error instanceof AppError) {
           throw error; 
        }
        throw new AppError(['something went wrong while adding user roles'], StatusCodes.INTERNAL_SERVER_ERROR);
    }
}




async function getRole(data) {
    try {
        const user = await userRepository.get(data.userId);
        if (!user) {
            throw new AppError(['user not found'], StatusCodes.NOT_FOUND);
        }

        const response = user.getRole();
        return response;

    } catch (error) {
        if (error instanceof AppError) {
           throw error; 
        }
        throw new AppError(['something went wrong while fatching user roles'], StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    createUser,
    signin,
    isAuthenticated,
    isAdmin,
    addRole,
    getRole
}