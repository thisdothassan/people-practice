const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { UnauthorizedError } = require("./errors");

const generateToken = (user) => {
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.secret);
    } catch (error) {
        throw new UnauthorizedError("Invalid token");
    }
};

module.exports = {generateToken, verifyToken};
