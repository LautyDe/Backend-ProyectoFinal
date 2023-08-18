import { cartsModel } from "../../mongoDb/models/carts.model.js";

export default class CartManager {
  async createCart() {
    const cart = await cartsModel.create({});
    return cart;
  }

  async getById(id) {
    const cart = await cartsModel
      .findOne({ _id: id })
      .populate("products.product")
      .lean();
    return cart;
  }

  async addToCart(cid, pid) {
    const cart = await cartsModel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    );
    if (!cart) {
      const cart = await cartsModel.findOneAndUpdate(
        { _id: cid },
        { $addToSet: { products: { product: pid, quantity: 1 } } },
        { new: true }
      );
      return cart;
    }
    return cart;
  }

  async deleteProduct(cid, pid) {
    const cart = await this.getById(cid);
    const quantity = cart.products.find(item => item.product._id).quantity;
    if (quantity > 1) {
      const cart = await cartsModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $set: { "products.$.quantity": quantity - 1 } },
        { new: true }
      );
      return cart;
    } else {
      const cart = await cartsModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { "products": { "product": pid } } },
        { new: true }
      );
      return cart;
    }
  }

  async deleteProductFromCart(cid, pid) {
    const cart = await cartsModel.findById(cid);
    cart.products = cart.products.filter(({ product }) => !product.equals(pid));
    await cart.save();
    return cart;
  }

  async deleteAllProducts(cid) {
    const cart = await cartsModel.findOneAndUpdate(
      { _id: cid },
      { $set: { products: [] } }
    );
    return cart;
  }
}

export const cartManager = new CartManager();
