import { cartManager } from "../DAL/DAOs/mongoDAOs/cartManagerMongo.js";
import ProductForTicketDTO from "../DAL/DTOs/productForTicket.dto.js";
import TicketDTO from "../DAL/DTOs/ticket.dto.js";
import { cartsModel } from "../DAL/mongoDb/models/carts.model.js";
import { productsModel } from "../DAL/mongoDb/models/products.model.js";
import { ticketsModel } from "../DAL/mongoDb/models/tickets.model.js";
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
          const productItem = new ProductForTicketDTO(
            product,
            cartProduct.quantity
          );
          productsForTicket.push(productItem);
        } else {
          productsWithoutStock.push(product._id.toString());
        }
      }
      cart.products = cart.products.filter(product =>
        productsWithoutStock.includes(product.product._id.toString())
      );
      await cart.save();
      console.log(productsForTicket);

      const firstTicket = {
        amount,
        purchaser: user.email,
        products: productsForTicket,
      };
      const ticketDto = new TicketDTO(firstTicket);
      const ticket = await ticketsModel.create(ticketDto);
      console.log(ticket);
      return { ticket, productsWithoutStock };
    } catch (error) {
      return error;
    }
  }
}

export const cartsService = new CartsService();
