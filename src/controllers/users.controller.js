import { usersManager } from "../DAL/DAOs/mongoDAOs/usersManagerMongo.js";
import config from "../config.js";
import CustomError from "../services/errors/CustomError.js";
import { ErrorMessage } from "../services/errors/error.enum.js";
import mongoose from "mongoose";

class UsersController {
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
}

/* ok: 200
   created: 201
   no content: 204
   bad request: 400
   forbidden: 403
   not found: 404
   internal server error: 500
    */

export const usersController = new UsersController();
