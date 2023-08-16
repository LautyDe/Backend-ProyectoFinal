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
        throw new Error(`Usuario o contraseña invalidos.`);
      }
    } catch (error) {
      console.log(`Error en el login: ${error.message}`);
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
}

export const usersManager = new UsersManager();
