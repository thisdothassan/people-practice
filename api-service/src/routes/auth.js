const express = require("express");
const router = express.Router();
const { AuthService } = require("../services");
const { registerSchema, loginSchema, validate } = require("../utils");

router.post("/register", validate(registerSchema), async (req, res, next) => {
    try {
        const result = await AuthService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
    try {
        const result = await AuthService.login(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
