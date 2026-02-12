const { CustomerRepository, UserRepository } = require("../repositories");
const { NotFoundError, ValidationError } = require("../utils");
const bcrypt = require("bcrypt");

class CustomerService {
  static async getAccessibleCustomers(user, filters = {}) {
    const scopeFilter = {};
    if (
      user.role === "admin" &&
      user.type === "location" &&
      user.locationScopes?.length
    ) {
      scopeFilter.locationIds = user.locationScopes;
    }
    return CustomerRepository.findAll({ ...filters, ...scopeFilter });
  }

  static async createCustomer(user, customerData) {
    const existingUser = await UserRepository.findByEmail(customerData.email);
    if (existingUser) {
      throw new ValidationError("Email already exists");
    }
    const password_hash = await bcrypt.hash(customerData.password, 10);
    const newUser = await UserRepository.create({
      email: customerData.email,
      password_hash,
      role: "customer",
    });
    return CustomerRepository.create(newUser.id, customerData);
  }

  static async updateCustomer(customerId, updates) {
    const customer = await CustomerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundError("Customer not found");
    }
    return CustomerRepository.update(customerId, updates);
  }
}

module.exports = CustomerService;
