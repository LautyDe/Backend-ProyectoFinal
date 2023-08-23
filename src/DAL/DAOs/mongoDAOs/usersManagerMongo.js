import CustomError from "../../../services/errors/CustomError.js";
import { ErrorMessage } from "../../../services/errors/error.enum.js";
import { compareData } from "../../../utils.js";
import { usersModel } from "../../mongoDb/models/users.model.js";

class UsersManager {
  async createUser(user) {
    try {
      const { email } = user;
      const alreadyExist = await usersModel.findOne({ email });
      if (!alreadyExist) {
        const newUser = await usersModel.create(user);
        return newUser;
      } else {
        throw new Error(`Usuario ya existente`);
      }
    } catch (error) {
      console.log(`Error creando el usuario: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      const allUsers = await usersModel.find().lean();
      return allUsers;
    } catch (error) {
      next(error);
    }
  }

  async deleteInactiveUsers() {
    const cutOffTime = new Date();
    cutOffTime.setHours(cutOffTime.getHours() - 48); //setMinutes(cutoffTime.getMinutes() - 2);
    const inactiveUsers = await usersModel.deleteMany({
      last_connection: { $lt: cutOffTime },
    });
    return inactiveUsers;
  }

  async loginUser(email, password) {
    try {
      const user = await usersModel.findOne({ email });
      if (!user) {
        return res.redirect("/loginError");
      }
      const passwordOk = await compareData(password, user.password);
      if (!passwordOk) {
        return res.redirect("/loginError");
      }

      if (user) {
        return user;
      } else {
        CustomError.createCustomError({
          message: ErrorMessage.WRONG_LOGIN,
          status: 400,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async findByEmail(email) {
    const user = await usersModel.findOne({ email });
    return user;
  }

  async findById(id) {
    const response = await usersModel.findOne({ _id: id });
    return response;
  }

  async deleteUser(id) {
    const response = await usersModel.deleteOne({ _id: id });
    return response;
  }
}

export const usersManager = new UsersManager();
