const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");
const { AUTHORIZATION_HEADER } = require("../utils/constant");
const jwt_decode = require("jwt-decode");
const { userService } = require("../services");

const authenticateUser = async (req, res, next) => {
  try {
    if (req.headers[AUTHORIZATION_HEADER]) {
      const token = req.headers[AUTHORIZATION_HEADER];
      if (!token || token == "") {
        next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
      }
      const decode = jwt_decode(token);
      const user = userService.getUserById(decode.sub);
      if (user.role === "user") {
        req.user = user;
        next();
      } else {
        next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            "Unauthorized"
          )
        );
      }
    } else {
      next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "Please attach authorization header"
        )
      );
    }
  } catch (e) {
    return next(new ApiError(httpStatus.BAD_REQUEST, e));
  }
};

module.exports = {
    authenticateUser
}
