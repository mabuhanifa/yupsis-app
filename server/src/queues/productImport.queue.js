import { Queue } from "bullmq";
import { connection } from "./connection.js";

export const productImportQueue = new Queue("product-import", { connection });
