const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // divide the request by a space and add 2 arrays for the token (Bearer Authentication)
    if (!token) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = tokenService.validateAccessToken();
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    req.user = userData;
    next();
  } catch (e) {
    console.log(e);
    return next(ApiError.UnauthorizedError());
  }
};
