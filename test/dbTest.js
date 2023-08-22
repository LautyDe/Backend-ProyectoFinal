import mongoose from "mongoose";
import config from "../src/config.js";
import { logger } from "../src/utils/winston.js";

try {
  await mongoose.connect(config.mongo_uri_test);
  logger.info("Conectado a la base de datos");
} catch (error) {
  logger.error(`Error conectando a la base de datos: ${error.message}`);
}
