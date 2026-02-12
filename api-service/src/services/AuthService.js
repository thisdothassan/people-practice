const bcrypt = require("bcrypt");
const { UserRepository, CustomerRepository } = require("../repositories");
const {
  generateToken,
  UnauthorizedError,
  ValidationError,
} = require("../utils");

class AuthService {
  static async register(data) {
    const { email, password, role = "customer" } = data;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError("Email already exists");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await UserRepository.create({
      email,
      password_hash,
      role,
    });

    const customer = await CustomerRepository.create(user.id, {
      location_id: data.location_id,
      first_name: data.first_name,
      last_name: data.last_name,
      shipping_address: data.shipping_address,
      billing_address: data.billing_address,
      phone: data.phone,
    });

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async login(data) {
    const { email, password } = data;

    // Find user
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = generateToken(user);

    const userPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    if (user.role === "admin") {
      const type = await UserRepository.getManagerTypeByUserId(user.id);
      if (type) userPayload.type = type;
    }

    return {
      user: userPayload,
      token,
    };
  }
}

module.exports = AuthService;
