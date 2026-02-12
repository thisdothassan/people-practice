const { verifyToken, UnauthorizedError } = require("../utils");
const { UserRepository } = require("../repositories");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    // Fetch full user with scopes
    const user = await UserRepository.findByIdWithScopes(decoded.userId);

    if (!user || !user.is_active) {
      throw new UnauthorizedError("User not found or inactive");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
