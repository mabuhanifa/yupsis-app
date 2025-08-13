import jwt from "jsonwebtoken";

const generateAuthTokens = (userId) => {
  console.log("--- Generating Tokens ---");
  console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
  console.log(
    "JWT_ACCESS_EXPIRATION_MINUTES:",
    process.env.JWT_ACCESS_EXPIRATION_MINUTES
  );

  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_ACCESS_EXPIRATION_MINUTES}m`,
  });
  return {
    access: {
      token: accessToken,
      expires: new Date(
        Date.now() + process.env.JWT_ACCESS_EXPIRATION_MINUTES * 60 * 1000
      ),
    },
  };
};

export const tokenService = {
  generateAuthTokens,
};
