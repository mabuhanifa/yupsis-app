import cors from "cors";
import "dotenv/config";
import express from "express";
import { testDbConnection } from "./db/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";
import apiRouter from "./routes/index.js";
import { NotFoundError } from "./utils/NotFoundError.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api", apiRouter);

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
