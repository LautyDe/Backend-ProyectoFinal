import { Router } from "express";
import { getCurrentSession } from "../controllers/sessions.controller.js";

const router = Router();

router.get("/", getCurrentSession.getSession);

export default router;
