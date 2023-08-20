import { codeGenerator } from "../../utils.js";

export default class ProductDTO {
  constructor(product) {
    this.code = codeGenerator();
    this.status = true;
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.thumbnail = product.thumbnail;
    this.category = product.category;
    this.stock = product.stock;
    this.owner = product.owner;
  }
}
