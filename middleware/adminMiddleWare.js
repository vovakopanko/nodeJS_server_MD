const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next(); //calls the next in the chain middleware
    }

    try {
      const token = req.headers.authorization.split(" ")[1]; // divide the request by a space and add 2 arrays for the token (Bearer Authentication)
      if (!token) {
        return res.status(403).json({
          message: "you do not have the rights to perform this operation",
        });
      }
      const { roles: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.status(403).json({
          message: `You don't have the rights to perform this operation`,
        });
      }
      next();
    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: "User is not logged in" });
    }
  };
};
