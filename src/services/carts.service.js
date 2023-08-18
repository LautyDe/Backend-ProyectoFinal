import { cartManager } from "../DAL/DAOs/mongoDAOs/cartManagerMongo.js";
import { ticketManager } from "../DAL/DAOs/mongoDAOs/ticketManagerMongo.js";
import { cartsModel } from "../DAL/mongoDb/models/carts.model.js";
import { productsModel } from "../DAL/mongoDb/models/products.model.js";

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

  async purchaseCart(cart, user) {
    let amount = 0;
    const cartM = await cartsModel.findById(cart);
    const productsWithoutStock = [];
    for (const cartItem of cartM.products) {
      const productM = await productsModel.findById(cartItem.product._id);
      if (cartItem.quantity <= cartItem.product.stock) {
        cartItem.product.stock -= cartItem.quantity;
        await productM.save();
        amount += cartItem.product.price * cartItem.quantity;
      } else {
        productsWithoutStock.push(cartItem.product._id.toString());
      }
    }

    cartM.products = cartM.products.filter(cartItem =>
      productsWithoutStock.includes(cartItem.product._id.toString())
    );
    await cartM.save();

    const ticket = { amount, purchaser: user.email };
    const ticketResponse = await ticketManager.createTicket(ticket);
    return { ticket: ticketResponse, productsWithoutStock };
  }
}

export const cartsService = new CartsService();
