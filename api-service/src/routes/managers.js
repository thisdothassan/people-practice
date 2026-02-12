const express = require("express");
const router = express.Router();
const { authenticate, authorize, authorizeResource } = require("../middleware");
const { ManagerService } = require("../services");
const { createManagerSchema, validate } = require("../utils");

router.get(
  "/",
  authenticate,
  authorize("managers:list"),
  async (req, res, next) => {
    try {
      const managers = await ManagerService.getManagers(req.query);
      res.json({ data: managers });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:id",
  authenticate,
  authorizeResource("manager", "view"),
  (req, res) => res.json({ data: req.manager }),
);

router.post(
  "/",
  authenticate,
  authorize("managers:create"),
  validate(createManagerSchema),
  async (req, res, next) => {
    try {
      const manager = await ManagerService.createManager(req.body);
      res.status(201).json({ data: manager });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
