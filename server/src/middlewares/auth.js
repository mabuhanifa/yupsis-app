import httpStatusCodes from "http-status-codes";
import passport from "passport";
import { ApiError } from "../utils/ApiError.js";

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(
      new ApiError(httpStatusCodes.UNAUTHORIZED, "Please authenticate")
    );
  }
  req.user = user;
  resolve();
};

const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
