import config from "../config.js";
import CustomError from "../services/errors/CustomError.js";
import { ErrorMessage } from "../services/errors/error.enum.js";
import { productsService } from "../services/products.service.js";

class AuthMiddleware {
  async authUser(req, res, next) {
    if (!req.user) {
      CustomError.createCustomError({
        message: ErrorMessage.SESSION_EXPIRED,
        status: 401,
      });
      return;
    }
    if (req.user.role === config.role_user) {
      next();
    } else {
      res.status(403).end();
    }
  }

  async authAdmin(req, res, next) {
    if (!req.user) {
      CustomError.createCustomError({
        message: ErrorMessage.SESSION_EXPIRED,
        status: 401,
      });
      return;
    }
    if (req.user.role === config.role_admin) {
      next();
    } else {
      res.status(403).end();
    }
  }

  async authPremium(req, res, next) {
    if (!req.user) {
      CustomError.createCustomError({
        message: ErrorMessage.SESSION_EXPIRED,
        status: 401,
      });
      return;
    }
    if (req.user.role === config.role_premium) {
      next();
    } else {
      res.status(403).end();
    }
  }

  authRoles(roles) {
    return function (req, res, next) {
      if (!req.user) {
        res.status(401).json("Session expired");
        return;
      }
      if (roles.includes(req.user.role)) {
        return next();
      } else {
        res.status(403).end();
        return;
      }
    };
  }

  async authProductOwnerOrAdmin(req, res, next) {
    try {
      const { role, email } = req.user;
      if (role === config.role_admin) {
        next();
        return;
      } else if (role === config.role_premium) {
        const { pid } = req.params;
        const product = await productsService.findById(pid);
        if (!product) {
          CustomError.createCustomError({
            message: ErrorMessage.PRODUCT_NOT_FOUND,
            status: 404,
          });
        }
        if (product.owner === email) {
          next();
          return;
        }
      }
      res.status(403).end();
    } catch (error) {
      next(error);
    }
  }

  async authOwnResource(req, res, next) {
    if (!req.user) {
      CustomError.createCustomError({
        message: ErrorMessage.SESSION_EXPIRED,
        status: 401,
      });
      return;
    }
    const { uid } = req.params;
    if (uid === req.user._id.toString()) {
      next();
    } else {
      res.status(403).end();
    }
  }

  async authPremiumUserAddToCart(req, res, next) {
    try {
      const { role, email } = req.user;
      if (role === config.role_premium) {
        const { pid } = req.params;
        const product = await productsService.findById(pid);
        if (!product) {
          CustomError.createCustomError({
            message: ErrorMessage.PRODUCT_NOT_FOUND,
            status: 404,
          });
        }
        if (product.owner === email) {
          res.status(403).end();
          return;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
