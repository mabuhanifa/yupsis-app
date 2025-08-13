import httpStatusCodes from "http-status-codes";
import { authService } from "../services/auth.service.js";
import { tokenService } from "../services/token.service.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(
      email,
      password
    );
    const tokens = tokenService.generateAuthTokens(user.id);
    res.send({ user, tokens });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res
      .status(error.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Login failed" });
  }
};

const getProfile = async (req, res) => {
  res.send(req.user);
};

export const authController = {
  login,
  getProfile,
};
