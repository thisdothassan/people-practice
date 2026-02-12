const express = require("express");
const router = express.Router();
const { authenticate, authorize, authorizeResource } = require("../middleware");
const { LocationService } = require("../services");
const {
  createLocationSchema,
  updateLocationSchema,
  validate,
} = require("../utils");

router.get(
  "/",
  authenticate,
  authorize("locations:list"),
  async (req, res, next) => {
    try {
      const locations = await LocationService.getAccessibleLocations(req.user);
      res.json({ data: locations });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:id",
  authenticate,
  authorizeResource("location", "view"),
  async (req, res, next) => {
    try {
      res.json({ data: req.location });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/",
  authenticate,
  authorize("locations:create"),
  validate(createLocationSchema),
  async (req, res, next) => {
    try {
      const location = await LocationService.createLocation(req.body);
      res.status(201).json({ data: location });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/:id",
  authenticate,
  authorizeResource("location", "update"),
  validate(updateLocationSchema),
  async (req, res, next) => {
    try {
      const location = await LocationService.updateLocation(
        req.location.id,
        req.body,
      );
      res.json({ data: location });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
