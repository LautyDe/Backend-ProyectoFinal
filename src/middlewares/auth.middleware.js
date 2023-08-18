import config from "../config.js";
import CustomError from "../services/errors/CustomError.js";
import { ErrorMessage } from "../services/errors/error.enum.js";
import { productsService } from "../services/products.service.js";

class AuthMiddleware {
  sessionExpired(req, res, next) {
    if (!req.user) {
      res.status(400).redirect("sessionExpired");
    } else {
      next();
    }
  }

  authAdmin(req, res, next) {
    if (req.user.role === config.role_admin) {
      res.locals.isAdmin = true;
      next();
    } else {
      res.locals.isAdmin = false;
      next();
    }
  }

  authUser(req, res, next) {
    if (req.user.role === config.role_user) {
      res.locals.isUser = true;
      next();
    } else {
      res.locals.isUser = false;
      next();
    }
  }
}

export const authMiddleware = new AuthMiddleware();
