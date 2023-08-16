import { productManager } from "../DAL/DAOs/mongoDAOs/productManagerMongo.js";
import { paramsValidator } from "../utils.js";
import ProductDTO from "../DAL/DTOs/product.dto.js";

class ProductsService {
  async addProduct(product) {
    const paramsOk = await paramsValidator(product);
    const productDto = new ProductDTO(paramsOk);
    const response = await productManager.addProduct(productDto);
    return response;
  }

  async findAll() {
    const response = await productManager.getAll();
    return response;
  }

  async getAllPaginated(limit, page, sort, query) {
    const response = await productManager.getAllPaginated(
      limit,
      page,
      sort,
      query
    );
    return response;
  }

  async findById(id) {
    const product = await productManager.getById(id);
    return product;
  }

  async updateProduct(id, product) {
    const response = await productManager.updateProduct(id, product);
    return response;
  }

  async deleteById(id) {
    const response = await productManager.deleteById(id);
    return response;
  }

  async aggregationFunc(limit, page, sort, query) {
    const response = await productManager.aggregationFunc(
      limit,
      page,
      sort,
      query
    );
    return response;
  }

  async deleteAll() {
    const response = await productManager.deleteAll();
    return response;
  }
}

export const productsService = new ProductsService();
