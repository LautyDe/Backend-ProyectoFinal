import { productsModel } from "../../mongoDb/models/products.model.js";

class ProductManager {
  async addProduct(product) {
    const newProduct = await productsModel.create(product);
    return newProduct;
  }

  async getAll() {
    const allProducts = await productsModel.find().lean(); //leer lean()
    return allProducts;
  }

  async getAllPaginated(limit, page, sort, query) {
    const search = query
      ? {
          stock: { $gte: 0 },
          $or: [
            { category: { $regex: query, $options: "i" } },
            { title: { $regex: query, $options: "i" } },
          ],
        }
      : {
          stock: { $gte: 0 },
        };

    if (sort === "asc") {
      sort = { price: 1 };
    } else if (sort === "desc") {
      sort = { price: -1 };
    }

    const options = {
      page: page || 1,
      limit: limit || 5,
      sort,
      lean: true,
    };

    const allProducts = await productsModel.paginate(search, options);
    return allProducts;
  }

  async getById(id) {
    const product = await productsModel.findOne({ _id: id }).lean();
    return product;
  }

  async updateProduct(id, product) {
    const response = await productsModel.findOneAndUpdate({ _id: id }, product);
    return response;
  }

  async deleteById(id) {
    const response = await productsModel.deleteOne({ _id: id });
    return response;
  }

  async aggregationFunc(limit = null, page = null, sort = null, query = null) {
    const response = await productsModel.aggregate([{ $match: { query } }]);
    return response;
  }

  async deleteAll() {
    await productsModel.deleteMany();
    return "Productos eliminados";
  }
}

export const productManager = new ProductManager();
