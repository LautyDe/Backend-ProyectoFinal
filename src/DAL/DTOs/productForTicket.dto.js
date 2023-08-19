export default class ProductForTicketDTO {
  constructor(product, cartQuantity) {
    this._id = product._id;
    this.quantity = cartQuantity.quantity;
  }
}
