import { cartManager } from "../DAL/DAOs/mongoDAOs/cartManagerMongo.js";
import { usersManager } from "../DAL/DAOs/mongoDAOs/usersManagerMongo.js";
import config from "../config.js";
import CustomError from "../services/errors/CustomError.js";
import { ErrorMessage } from "../services/errors/error.enum.js";
import mongoose from "mongoose";

/* ok: 200
created: 201
   no content: 204
   bad request: 400
   forbidden: 403
   not found: 404
   internal server error: 500
    */

class UsersController {
  async getAllUsers(req, res, next) {
    try {
      const users = await usersManager.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async deleteInactives(req, res, next) {
    try {
      const inactiveUsers = await usersManager.deleteInactiveUsers();
      res.json(inactiveUsers);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { uid } = req.params;
      const user = await usersManager.findById(uid);
      const usersCart = user.cart;
      const cart = await cartManager.deleteCart(usersCart);
      const userDeleted = await usersManager.deleteUser(uid);
      res.json(userDeleted);
    } catch (error) {
      next(error);
    }
  }

  async togglePremium(req, res, next) {
    try {
      const { uid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(uid)) {
        CustomError.createCustomError({
          message: ErrorMessage.INVALID_USER_ID,
          status: 400,
        });
      }
      const user = await usersManager.findById(uid);
      if (!user) {
        CustomError.createCustomError({
          message: ErrorMessage.USER_NOT_FOUND,
          status: 404,
        });
      }
      if (user.role === config.role_admin) {
        CustomError.createCustomError({
          message: "Admin cannot be premium",
          status: 400,
        });
      }

      if (user.role === config.role_user) {
        user.role = config.role_premium;
      } else {
        user.role = config.role_user;
      }

      await user.save();
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async uploadFiles(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        CustomError.createCustomError({
          message: "Could not save documents",
          status: 400,
        });
      }
      const { uid } = req.params;
      const user = await usersManager.findById(uid);
      const newDocuments = req.files.map(file => ({
        name: file.originalname,
        reference: file.path,
      }));
      user.documents = [...user.documents, ...newDocuments];
      await user.save();
      res.send({ message: "Files saved" });
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();
