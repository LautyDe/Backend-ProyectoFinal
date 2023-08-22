import { Router } from "express";
import { productsController } from "../../controllers/products.controller.js";

const router = Router();

router.get("/", productsController.getAll);

router.get("/:pid", productsController.getProductById);

router.post("/", productsController.addProduct);

router.put("/:pid", productsController.updateProduct);

router.delete("/:pid", productsController.deleteProductById);

export default router;
