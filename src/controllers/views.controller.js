import { productsService } from "../services/products.service.js";
import { chatService } from "../services/chat.service.js";
import { cartsService } from "../services/carts.service.js";
import CustomError from "../services/errors/CustomError.js";
import { ErrorMessage } from "../services/errors/error.enum.js";
import { usersManager } from "../DAL/DAOs/mongoDAOs/usersManagerMongo.js";
import config from "../config.js";

/* ok: 200
   created: 201
   no content: 204
   bad request: 400
   forbidden: 403
   not found: 404
   internal server error: 500
    */
function buildUserData(res) {
  return {
    isAdmin: res.locals.isAdmin,
    isPremium: res.locals.isPremium,
    canShowRealtime: res.locals.isPremium || res.locals.isAdmin,
  };
}
class ViewsController {
  async login(req, res, next) {
    try {
      res.render("login");
    } catch (error) {
      next(error);
    }
  }

  async loginError(req, res, next) {
    try {
      res.render("loginError");
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      res.render("register");
    } catch (error) {
      next(error);
    }
  }

  async registerOk(req, res, next) {
    try {
      res.render("registerOk");
    } catch (error) {
      next(error);
    }
  }

  async registerError(req, res, next) {
    try {
      res.render("registerError");
    } catch (error) {
      next(error);
    }
  }

  async sessionExpired(req, res, next) {
    try {
      res.render("sessionExpired");
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      req.session.destroy(err => {
        if (err) {
          CustomError.createCustomError({
            message: ErrorMessage.SESSION_NOT_DESTROYED,
            status: 500,
          });
        } else {
          res.render("logout");
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async products(req, res, next) {
    try {
      const usersCartId = req.user.cart.toString();
      const products = await productsService.findAll();
      const productsToString = products.map(product => ({
        ...product,
        _id: product._id.toString(),
        ownProduct: product.owner === req.user.email,
      }));
      const user = req.user;
      const renderData = {
        style: "products.css",
        title: "Products",
        products: productsToString,
        userName: user.name,
        user,
        cartId: usersCartId,
        ...buildUserData(res),
      };
      res.render("products", renderData);
    } catch (error) {
      next(error);
    }
  }

  async realTimeProducts(req, res, next) {
    try {
      const products = await productsService.findAll();
      const renderData = {
        style: "realTimeProducts.css",
        title: "Real Time Products",
        products: products,
        owner: req.user.email,
        role: req.user.role,
        userId: req.user._id,
      };
      res.render("realTimeProducts", renderData);
    } catch (error) {
      next(error);
    }
  }

  async users(req, res, next) {
    try {
      const allUsers = await usersManager.getAllUsers();
      const usersWithoutAdmin = allUsers.filter(
        user => user.role !== config.role_admin
      );
      const formattedUsers = usersWithoutAdmin.map(user => ({
        ...user,
        last_connection: (function () {
          const date = new Date(user.last_connection);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const seconds = String(date.getSeconds()).padStart(2, "0");
          return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        })(),
      }));
      const renderData = {
        style: "users.css",
        users: formattedUsers,
        ...buildUserData(res),
      };
      res.render("users", renderData);
    } catch (error) {
      next(error);
    }
  }

  async chat(req, res, next) {
    try {
      const messages = await chatService.findAllMessages();
      res.render("chat", {
        style: "chat.css",
        title: "Chat",
        messages: messages,
        ...buildUserData(res),
      });
    } catch (error) {
      next(error);
    }
  }

  async carts(req, res, next) {
    try {
      const usersCart = req.user._doc.cart.toString();
      const cart = await cartsService.findById(usersCart);
      cart.products.forEach(
        item => (item.total = item.quantity * item.product.price)
      );
      res.render("carts", {
        style: "carts.css",
        title: "Carts",
        cartId: usersCart,
        products: cart.products.map(item => ({
          productId: item.product._id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          stock: item.product.stock,
        })),
        cartTotal: cart.products.reduce((acc, curr) => (acc += curr.total), 0),
        ...buildUserData(res),
      });
    } catch (error) {
      next(error);
    }
  }
}

export const viewsController = new ViewsController();
