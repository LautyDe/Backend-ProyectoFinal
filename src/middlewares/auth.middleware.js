import config from "../config.js";

class AuthMiddleware {
  sessionExpired(req, res, next) {
    if (!req.user) {
      res.status(400).redirect("sessionExpired");
    } else {
      next();
    }
  }

  authAdmin(req, res, next) {
    res.locals.isAdmin = req.user.role === config.role_admin;
    next();
  }

  authUser(req, res, next) {
    res.locals.isUser = req.user.role === config.role_user;
    next();
  }

  authPremium(req, res, next) {
    res.locals.isPremium = req.user.role === config.role_premium;
    next();
  }
}

export const authMiddleware = new AuthMiddleware();
