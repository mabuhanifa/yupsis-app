import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import passport from "passport";
import { jwtStrategy } from "./config/passport.js";
import { testDbConnection } from "./db/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";
import mainRouter from "./routes/index.js";
import { NotFoundError } from "./utils/NotFoundError.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.startsWith("/api/webhooks")) {
        req.rawBody = buf.toString();
      }
    },
  })
);
app.use(logger);

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use("/api", mainRouter);

app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

const startServer = async () => {
  await testDbConnection();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
