import hbs from "nodemailer-express-handlebars";
import mongoose from "mongoose";
import { usersManager } from "../DAL/DAOs/mongoDAOs/usersManagerMongo.js";
import CustomError from "../services/errors/CustomError.js";
import { ErrorMessage } from "../services/errors/error.enum.js";
import {
  __dirname,
  compareData,
  hashData,
  resetPasswordLink,
  lessThanOneHour,
} from "../utils.js";
import { transporter } from "../utils/nodemailer.js";
import path from "path";
import { logger } from "../utils/winston.js";

class RecoveryController {
  async recoverPage(req, res, next) {
    try {
      res.render("recoverPage");
    } catch (error) {
      next(error);
    }
  }

  async changePassPage(req, res, next) {
    try {
      const { token, uid } = req.query;
      if (!token) {
        CustomError.createCustomError({
          message: ErrorMessage.TOKEN_MISSING,
          status: 400,
        });
      }
      if (!uid) {
        CustomError.createCustomError({
          message: ErrorMessage.ID_MISSING,
          status: 400,
        });
      }
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
      const timestamp = parseInt(
        Buffer.from(token, "base64").toString("utf-8")
      );
      if (!lessThanOneHour(timestamp)) {
        res.render("recoverPage");
        return;
      }
      res.render("changePassPage", { uid: user.id });
    } catch (error) {
      next(error);
    }
  }

  async recover(req, res, next) {
    const { email } = req.body;
    const user = await usersManager.findByEmail(email);
    if (!user) {
      CustomError.createCustomError({
        message: ErrorMessage.USER_NOT_FOUND,
        status: 404,
      });
    }
    //nodemailer transporter
    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          partialsDir: path.resolve(__dirname, "views"),
          defaultLayout: false,
        },
        viewPath: path.resolve(__dirname, "views"),
        extName: ".hbs",
      })
    );
    //send mail with options
    let mail = {
      from: "CODERHOUSE ECOMMERCE",
      to: email,
      subject: "Test",
      context: {
        name: user.name,
        link: resetPasswordLink(user._id),
      },
      template: "changePassLink",
    };
    transporter.sendMail(mail, (error, info) => {
      if (error) {
        CustomError.createCustomError({
          message: ErrorMessage.MAIL_NOT_SEND,
          status: 401,
          cause: error.message,
        });
      } else {
        logger.info("MAIL SENT!!");
        res.status(200).json({ message: "Email sent successfully" });
      }
    });
  }

  async changePass(req, res, next) {
    try {
      const { uid, password } = req.body;
      if (!mongoose.Types.ObjectId.isValid(uid)) {
        throw CustomError.createCustomError({
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
      if (!password) {
        CustomError.createCustomError({
          message: ErrorMessage.MISSING_PASSWORD,
          status: 400,
        });
      }
      if (await compareData(password, user.password)) {
        CustomError.createCustomError({
          message: ErrorMessage.SAME_PASSWORD,
          status: 400,
        });
      }
      user.password = await hashData(password);
      await user.save();
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
}

export const recoveryController = new RecoveryController();
