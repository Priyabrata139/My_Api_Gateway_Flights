const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { UserService } = require("../services");

const { isPublicRequest } = require("../utils/authUtil/authUtil");

async function checkAuth(req, res, next) {
  try {
    console.log("req=", req.url);
    const incomeingUrl = req.url;
    const incomeingMethod = req.method;

    if (isPublicRequest(incomeingUrl, incomeingMethod)) {
      next();
      return;
    }
    const token = req.headers["x-access-token"];
    if (!token) {
      throw new AppError(
        [
          "x-access-token is missing in the incomeing request in the correct form",
        ],
        StatusCodes.BAD_REQUEST
      );
    }
    const response = await UserService.isAuthenticated(token);
    if (response) {
      req.user = response;

      next();
    }
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function isAdmin(req, res, next) {
  try {
    const admin = await UserService.isAdmin({ userId: req.user });
    if (!admin) {
      throw new AppError(["Only admin can add roles"], StatusCodes.BAD_REQUEST);
    }
    next();
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function passRole(req, res, next) {
  try {
    const incomeingUrl = req.url;
    const incomeingMethod = req.method;

    if (isPublicRequest(incomeingUrl, incomeingMethod)) {
      next();
      return;
    }
    const userRoles = await UserService.getRole({ userId: req.user });

    const rolesArray = [];

    userRoles.forEach((role) => {
      rolesArray.push(role.name);
    });
    console.log(rolesArray);
    req.headers["user-roles"] = rolesArray;
    req.headers["user"] = req.user;
    // req.setHeader('user-roles', rolesArray);

    next();
  } catch (error) {
    console.log(error);
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  checkAuth,
  isAdmin,
  passRole,
};
