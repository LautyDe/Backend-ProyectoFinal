import { Router } from "express";
import views from "./viewsRouter/views.router.js";
import users from "./users.router.js";
import mockProducts from "./mockProducts.router.js";
import loggerTest from "./loggerTestRouter.js";
import apiRouters from "./api.routers.js";

const router = Router();

router.use("/", views);
router.use("/api", apiRouters);
router.use("/users", users);
router.use("/test/mockProducts", mockProducts);
router.use("/loggerTest", loggerTest);

export default router;
