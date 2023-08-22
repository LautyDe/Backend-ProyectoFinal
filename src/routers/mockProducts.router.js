import { Router } from "express";
import { generateDBProduct } from "../mock/mockProducts.test.js";

const router = Router();

router.get("/", (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    const productsMock = generateDBProduct();
    products.push(productsMock);
  }
  res.json(products);
});

export default router;
