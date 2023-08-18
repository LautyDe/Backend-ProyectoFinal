import { Router } from "express";
import products from "./products.router.js";
import carts from "./carts.router.js";
import views from "./viewsRouter/views.router.js";
import users from "./users.router.js";
import mockProducts from "./mockProducts.router.js";
import currentSession from "./sessions.router.js";
import loggerTest from "./loggerTestRouter.js";

const router = Router();

router.use("/", views);
router.use("/test/mockProducts", mockProducts);
router.use("/users", users);
router.use("/api/products", products);
router.use("/api/carts", carts);
router.use("/api/sessions/current", currentSession);
router.use("/loggerTest", loggerTest);

export default router;
