import UserCurrentDTO from "../DAL/DTOs/userCurrent.dto.js";
import CustomError from "../services/errors/CustomError.js";
import { ErrorMessage } from "../services/errors/error.enum.js";

class SessionController {
  async getSession(req, res, next) {
    try {
      if (!req.user) {
        CustomError.createCustomError({
          message: ErrorMessage.SESSION_EXPIRED,
          status: 401,
        });
      }
      const userCurrentDto = new UserCurrentDTO(req.user);
      res.json(userCurrentDto);
    } catch (error) {
      next(error);
    }
  }
}

export const getCurrentSession = new SessionController();
