module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message); //parents constructor
    this.status = status; // instance class Error
    this.errors = errors; // instance class Error
  }
  //static func which do not need to create an instance (экземпляр) of the class
  static UnauthorizedError() {
    return new ApiError(401, "The user is not authorized");
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
};
