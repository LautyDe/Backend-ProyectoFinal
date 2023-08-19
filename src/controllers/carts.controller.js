import { cartsModel } from "../DAL/mongoDb/models/carts.model.js";
import { productsModel } from "../DAL/mongoDb/models/products.model.js";
import { cartsService } from "../services/carts.service.js";
import CustomError from "../services/errors/CustomError.js";
import { ErrorMessage } from "../services/errors/error.enum.js";
import { transporter } from "../utils/nodemailer.js";
import { logger } from "../utils/winston.js";
import mongoose from "mongoose";

/* ok: 200
   created: 201
   no content: 204
   bad request: 400
   forbidden: 403
   not found: 404
   internal server error: 500
    */

class CartsController {
  async createCart(req, res, next) {
    try {
      const cart = await cartsService.createOne();
      res.status(201).json(cart);
    } catch (error) {
      next(error);
    }
  }

  async getOneCart(req, res, next) {
    try {
      const { cid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw CustomError.createCustomError({
          message: ErrorMessage.INVALID_CART_ID,
          status: 400,
        });
      }
      const cart = await cartsService.findById(cid);
      if (!cart) {
        CustomError.createCustomError({
          message: ErrorMessage.CART_NOT_FOUND,
          status: 404,
        });
      } else {
        res.status(200).json(cart);
      }
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req, res, next) {
    try {
      const { cid, pid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw CustomError.createCustomError({
          message: ErrorMessage.INVALID_CART_ID,
          status: 400,
        });
      }
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw CustomError.createCustomError({
          message: ErrorMessage.INVALID_PRODUCT_ID,
          status: 400,
        });
      }
      const cartId = await cartsModel.findOne({ _id: cid });
      if (!cartId) {
        CustomError.createCustomError({
          message: ErrorMessage.CART_NOT_FOUND,
          status: 404,
        });
      }
      const productId = await productsModel.findOne({ _id: pid });
      if (!productId) {
        CustomError.createCustomError({
          message: ErrorMessage.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }
      const cart = await cartsService.addToCart(cid, pid);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }

  async deleteAllProducts(req, res, next) {
    try {
      const { cid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw CustomError.createCustomError({
          message: ErrorMessage.INVALID_CART_ID,
          status: 400,
        });
      }
      const cartId = await cartsModel.findOne({ _id: cid });
      if (!cartId) {
        CustomError.createCustomError({
          message: ErrorMessage.CART_NOT_FOUND,
          status: 404,
        });
      }
      const updatedCart = await cartsService.deleteAllProducts(cid);
      res.status(200).json(updatedCart);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { cid, pid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw CustomError.createCustomError({
          message: ErrorMessage.INVALID_CART_ID,
          status: 400,
        });
      }
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw CustomError.createCustomError({
          message: ErrorMessage.INVALID_PRODUCT_ID,
          status: 400,
        });
      }
      const cartId = await cartsModel.findOne({ _id: cid });
      if (!cartId) {
        CustomError.createCustomError({
          message: ErrorMessage.CART_NOT_FOUND,
          status: 404,
        });
      }
      const productId = await productsModel.findOne({ _id: pid });
      if (!productId) {
        CustomError.createCustomError({
          message: ErrorMessage.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }
      const cart = await cartsService.deleteProduct(cid, pid);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }

  async deleteProductFromCart(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const cart = await cartsService.findById(cid);
      if (!cart) {
        CustomError.createCustomError({
          message: ErrorMessage.CART_NOT_FOUND,
          status: 404,
          cause: error.message,
        });
      }
      const newCart = await cartsService.deleteProductFromCart(cid, pid);
      res.status(200).json(newCart);
    } catch (error) {
      next(error);
    }
  }

  async purchase(req, res, next) {
    try {
      const { cid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw CustomError.createCustomError({
          message: ErrorMessage.INVALID_CART_ID,
          status: 400,
        });
      }
      const cart = await cartsService.findById(cid);
      if (!cart) {
        CustomError.createCustomError({
          message: ErrorMessage.CART_NOT_FOUND,
          status: 404,
        });
      }
      const result = await cartsService.purchaseCart(
        cart._id.toString(),
        req.user
      );
      const mail = {
        from: "lauty.d.p@gmail.com",
        to: req.user.email,
        subject: "Purchase succesfuly",
        text: `${req.user.name} your purchase was succesfully. Your ticket id: ${result.ticket.code}. Total price: ${result.ticket.amount}`,
      };
      transporter.sendMail(mail, (error, info) => {
        if (error) {
          logger.error(error);
        }
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const cartsController = new CartsController();
