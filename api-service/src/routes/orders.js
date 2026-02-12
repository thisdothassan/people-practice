const express = require("express");
const router = express.Router();
const { authenticate, authorize, authorizeResource } = require("../middleware");
const { OrderService } = require("../services");
const { createOrderSchema, validate } = require("../utils");

router.get(
  "/",
  authenticate,
  authorize("orders:list"),
  async (req, res, next) => {
    try {
      const orders = await OrderService.getAccessibleOrders(
        req.user,
        req.query,
      );
      res.json({ data: orders });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:id",
  authenticate,
  authorizeResource("order", "view"),
  (req, res) => res.json({ data: req.order }),
);

router.post(
  "/",
  authenticate,
  authorize("orders:create"),
  validate(createOrderSchema),
  async (req, res, next) => {
    try {
      const order = await OrderService.createOrder(req.user, req.body);
      res.status(201).json({ data: order });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
