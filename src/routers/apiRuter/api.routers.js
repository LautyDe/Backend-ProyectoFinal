import { Router } from "express";
import products from "./products.router.js";
import carts from "./carts.router.js";
import currentSession from "./sessions.router.js";
import users from "./users.router.js";

const router = Router();

router.use("/products", products);
router.use("/carts", carts);
router.use("/sessions/current", currentSession);
router.use("/users", users);

export default router;
