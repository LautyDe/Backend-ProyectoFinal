import mongoose from "mongoose";
import config from "../../config.js";
import { logger } from "../../utils/winston.js";

try {
  await mongoose.connect(config.mongo_uri);
  logger.info("Conectado a la base de datos");
} catch (error) {
  logger.error(`Error conectando a la base de datos: ${error.message}`);
}
