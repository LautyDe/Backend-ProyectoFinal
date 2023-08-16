import { Router } from "express";
import { logger } from "../utils/winston.js";

const router = Router();

router.get("/", (req, res) => {
  logger.fatal("Showing Fatal log");
  logger.error("Showing Error log");
  logger.warning("Showing Warning log");
  logger.info("Showing Info log");
  logger.http("Showing Http log");
  logger.debug("Showing Debug log");
  res.send("My first Logger in Winston");
});

export default router;
