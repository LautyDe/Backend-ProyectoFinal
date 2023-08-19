import { Router } from "express";
import passport from "passport";
import { recoveryController } from "../controllers/recovery.controller.js";
import { usersController } from "../controllers/users.controller.js";

const router = Router();

//passport
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/loginError",
    successRedirect: "/products",
  })
);
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/registerError",
    successRedirect: "/registerOk",
  })
);
router.get("/logout", (req, res) => {
  req.user.last_connection = new Date();
  req.user.save();
  res.redirect("/logout");
});
//github
router.get(
  "/registerGitHub",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get("/github", passport.authenticate("github"), (req, res) => {
  res.redirect("/products");
});

//recover
router.get("/recoverPage", recoveryController.recoverPage);
router.get("/changePassPage", recoveryController.changePassPage);
router.post("/recover", recoveryController.recover);
router.post("/changePass", recoveryController.changePass);
router.get("/premium/:uid", usersController.togglePremium);

export default router;
