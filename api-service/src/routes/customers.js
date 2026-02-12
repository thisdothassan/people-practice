const express = require("express");
const router = express.Router();
const { authenticate, authorize, authorizeResource } = require("../middleware");
const { CustomerService } = require("../services");
const {
  createCustomerSchema,
  updateCustomerSchema,
  validate,
} = require("../utils");

router.get(
  "/",
  authenticate,
  authorize("customers:list"),
  async (req, res, next) => {
    try {
      const customers = await CustomerService.getAccessibleCustomers(
        req.user,
        req.query,
      );
      res.json({ data: customers });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:id",
  authenticate,
  authorizeResource("customer", "view"),
  (req, res) => res.json({ data: req.customer }),
);

router.post(
  "/",
  authenticate,
  authorize("customers:create"),
  validate(createCustomerSchema),
  async (req, res, next) => {
    try {
      const customer = await CustomerService.createCustomer(req.user, req.body);
      res.status(201).json({ data: customer });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/:id",
  authenticate,
  authorizeResource("customer", "update"),
  validate(updateCustomerSchema),
  async (req, res, next) => {
    try {
      const customer = await CustomerService.updateCustomer(
        req.customer.id,
        req.body,
      );
      res.json({ data: customer });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
