const { OrderRepository, CustomerRepository } = require("../repositories");
const { ForbiddenError, NotFoundError } = require("../utils");

class OrderService {
  static async getAccessibleOrders(user, filters = {}) {
    if (user.role === "customer") {
      if (!user.customerId) return [];
      return OrderRepository.findAll({
        customerId: user.customerId,
        ...filters,
      });
    }
    const scopeFilter = {};
    if (user.role === "admin") {
      if (user.type === "location" && user.locationScopes?.length) {
        scopeFilter.locationIds = user.locationScopes;
      } else if (user.type === "product" && user.productScopes?.length) {
        scopeFilter.productIds = user.productScopes;
      }
    }
    return OrderRepository.findAll({ ...filters, ...scopeFilter });
  }

  static async createOrder(user, orderData) {
    if (user.role === "customer") {
      const customer = await CustomerRepository.findByUserId(user.id);
      if (!customer) {
        throw new ForbiddenError("Customer profile not found");
      }
      if (Number(orderData.customer_id) !== customer.id) {
        throw new ForbiddenError("You can only create orders for yourself");
      }
    }
    return OrderRepository.create(orderData);
  }
}

module.exports = OrderService;
