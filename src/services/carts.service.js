import { cartManager } from "../DAL/DAOs/mongoDAOs/cartManagerMongo.js";
import { ticketManager } from "../DAL/DAOs/mongoDAOs/ticketManagerMongo.js";
import { cartsModel } from "../DAL/mongoDb/models/carts.model.js";
import { productsModel } from "../DAL/mongoDb/models/products.model.js";
import { codeGenerator } from "../utils.js";
import CustomError from "./errors/CustomError.js";
import { ErrorMessage } from "./errors/error.enum.js";

class CartsService {
  async findById(id) {
    const response = await cartManager.getById(id);
    return response;
  }

  async createOne() {
    const response = await cartManager.createCart();
    return response;
  }

  async addToCart(cid, pid) {
    const response = await cartManager.addToCart(cid, pid);
    return response;
  }

  async deleteProduct(cid, pid) {
    const response = await cartManager.deleteProduct(cid, pid);
    return response;
  }

  async deleteProductFromCart(cid, pid) {
    const cart = await cartManager.deleteProductFromCart(cid, pid);
    return cart;
  }

  async deleteAllProducts(cid) {
    const response = await cartManager.deleteAllProducts(cid);
    return response;
  }

  async purchaseCart(cartId, user) {
    try {
      let amount = 0;
      let productsForTicket = [];
      const cart = await cartsModel.findById(cartId);
      const productsWithoutStock = [];
      for (const cartProduct of cart.products) {
        const product = await productsModel.findById(cartProduct.product);
        if (!product) {
          CustomError.createCustomError({
            message: ErrorMessage.PRODUCT_NOT_FOUND,
            status: 404,
          });
        }
        if (cartProduct.quantity <= product.stock) {
          product.stock -= cartProduct.quantity;
          await product.save();
          amount += product.price * cartProduct.quantity;
          const productItem = {
            _id: product.id,
            quantity: cartProduct.quantity,
          };
          productsForTicket.push(productItem);
          console.log("PFT", productsForTicket);
        } else {
          productsWithoutStock.push(product._id.toString());
        }
      }
      cart.products = cart.products.filter(product =>
        productsWithoutStock.includes(product.product._id.toString())
      );
      await cart.save();

      const cleanTicket = {
        code: codeGenerator(),
        amount,
        purchaser: user.email,
        products: productsForTicket,
      };
      console.log("cleanTicket", cleanTicket);
      const ticket = await ticketManager.createTicket(cleanTicket);
      console.log("ticket", ticket);
      return { ticket, productsWithoutStock };
    } catch (error) {
      return error;
    }
  }
}

export const cartsService = new CartsService();
