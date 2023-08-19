import { Router } from "express";
import { viewsController } from "../../controllers/views.controller.js";
import { recoveryController } from "../../controllers/recovery.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", viewsController.login);
router.get("/loginError", viewsController.loginError);
router.get("/register", viewsController.register);
router.get("/registerOk", viewsController.registerOk);
router.get("/registerError", viewsController.registerError);
router.get("/logout", viewsController.logout);
router.get(
  "/products",
  authMiddleware.sessionExpired,
  authMiddleware.authAdmin,
  authMiddleware.authPremium,
  viewsController.products
);
router.get(
  "/realtimeproducts",
  authMiddleware.sessionExpired,
  authMiddleware.authAdmin,
  authMiddleware.authPremium,
  viewsController.realTimeProducts
);
router.get(
  "/chat",
  authMiddleware.sessionExpired,
  authMiddleware.authAdmin,
  authMiddleware.authPremium,
  authMiddleware.authUser,
  viewsController.chat
);
router.get(
  "/carts",
  authMiddleware.sessionExpired,
  authMiddleware.authAdmin,
  authMiddleware.authPremium,
  viewsController.carts
);
router.get("/recoverPage", recoveryController.recoverPage);
router.get("/changePassPage", recoveryController.changePassPage);
router.get("/sessionExpired", viewsController.sessionExpired);

export default router;
