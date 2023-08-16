import { Router } from "express";
import { generateProduct } from "../mock/mockProducts.test.js";

const router = Router();

router.get("/", (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    const productsMock = generateProduct();
    products.push(productsMock);
  }
  res.json(products);
});

export default router;
