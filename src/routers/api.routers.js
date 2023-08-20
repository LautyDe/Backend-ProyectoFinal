import { Router } from "express";
import products from "./products.router.js";
import carts from "./carts.router.js";
import currentSession from "./sessions.router.js";

const router = Router();

router.use("/products", products);
router.use("/carts", carts);
router.use("/sessions/current", currentSession);

export default router;
