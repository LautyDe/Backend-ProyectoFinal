import { Router } from "express";
import viewsRouters from "./viewsRouter/views.router.js";
import mockProducts from "./mockProducts.router.js";
import loggerTest from "./loggerTestRouter.js";
import apiRouters from "./apiRuter/api.routers.js";

const router = Router();

router.use("/", viewsRouters);
router.use("/api", apiRouters);
router.use("/test/mockProducts", mockProducts);
router.use("/loggerTest", loggerTest);

export default router;
