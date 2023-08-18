import { productsModel } from "../DAL/mongoDb/models/products.model.js";
import CustomError from "../services/errors/CustomError.js";
import { ErrorMessage } from "../services/errors/error.enum.js";
import { productsService } from "../services/products.service.js";
import mongoose from "mongoose";

/* ok: 200
   created: 201
   no content: 204
   bad request: 400
   forbidden: 403
   not found: 404
   internal server error: 500
    */

class ProductsController {
  async getAll(req, res, next) {
    try {
      const { limit, page, sort, query } = req.query;
      const products = await productsService.getAllPaginated(
        limit,
        page,
        sort,
        query
      );
      products.docs = await products.docs.map(product => {
        const {
          _id,
          title,
          description,
          price,
          code,
          stock,
          category,
          thumbnail,
        } = product;
        return {
          id: _id,
          title,
          description,
          price,
          code,
          stock,
          category,
          thumbnail,
        };
      });
      const info = {
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `http://localhost:8080/api/products?page=${products.prevPage}&?limit=${limit}`
          : null,
        nextLink: products.hasNextPage
          ? `http://localhost:8080/api/products?page=${products.nextPage}&?limit=${limit}`
          : null,
      };
      res.status(200).send({ status: "success", payload: products.docs, info });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { pid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        CustomError.createCustomError({
          message: ErrorMessage.INVALID_PRODUCT_ID,
          status: 400,
        });
      }
      const product = await productsService.findById(pid);
      if (!product) {
        CustomError.createCustomError({
          message: ErrorMessage.PRODUCT_NOT_FOUND,
          status: 404,
        });
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      next(error);
    }
  }

  async addProduct(req, res, next) {
    try {
      const product = req.body;
      console.log("product en addProduct", product);
      const addedProduct = await productsService.addProduct(product);
      console.log("added product", addedProduct);
      res.status(201).json(addedProduct);
    } catch (error) {
      console.log("error en log de addProduct", error);
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { pid } = req.params;
      const modification = req.body;
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw CustomError.createCustomError({
          message: ErrorMessage.INVALID_PRODUCT_ID,
          status: 400,
        });
      }
      const product = await productsModel.findOne({ _id: pid });
      if (!product) {
        throw CustomError.createCustomError({
          message: ErrorMessage.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }
      const modifiedProduct = await productsService.updateProduct(
        pid,
        modification
      );
      res.status(200).json(modifiedProduct);
    } catch (error) {
      next(error);
    }
  }

  async deleteProductById(req, res, next) {
    try {
      const { pid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw CustomError.createCustomError({
          message: ErrorMessage.INVALID_PRODUCT_ID,
          status: 400,
        });
      }
      const product = await productsModel.findOne({ _id: pid });
      if (!product) {
        throw CustomError.createCustomError({
          message: ErrorMessage.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }
      const removedProduct = await productsService.deleteById(pid);
      res.status(200).json(removedProduct);
    } catch (error) {
      next(error);
    }
  }

  async deleteAllProducts(req, res) {
    const removedProducts = await productsService.deleteAll();
    !removedProducts
      ? res.status(404).json({ error: "No se pudieron eliminar los productos" })
      : res.status(200).json(removedProducts);
  }
}

export const productsController = new ProductsController();
