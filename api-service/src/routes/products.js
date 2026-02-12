const express = require("express");
const router = express.Router();
const { authenticate, authorize, authorizeResource } = require("../middleware");
const { ProductService } = require("../services");
const {
  createProductSchema,
  updateProductSchema,
  validate,
} = require("../utils");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const products = await ProductService.getProducts();
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  authenticate,
  authorize("products:create"),
  validate(createProductSchema),
  async (req, res, next) => {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json({ data: product });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/:id",
  authenticate,
  authorizeResource("product", "update"),
  validate(updateProductSchema),
  async (req, res, next) => {
    try {
      const product = await ProductService.updateProduct(
        req.product.id,
        req.body,
      );
      res.json({ data: product });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
