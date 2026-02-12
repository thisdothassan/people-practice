const OrderPolicy = require("../../src/policies/OrderPolicy");

describe("OrderPolicy", () => {
  describe("canViewList", () => {
    it("admin can view order list", () => {
      const admin = { role: "admin" };
      const policy = new OrderPolicy(admin);
      expect(policy.canViewList()).toBe(true);
    });

    it("location manager can view order list", () => {
      const manager = { role: "location_manager", locationScopes: [1] };
      const policy = new OrderPolicy(manager);
      expect(policy.canViewList()).toBe(true);
    });

    it("product manager can view order list", () => {
      const manager = { role: "product_manager", productScopes: [1] };
      const policy = new OrderPolicy(manager);
      expect(policy.canViewList()).toBe(true);
    });

    it("customer cannot view order list (for management)", () => {
      const customer = { role: "customer" };
      const policy = new OrderPolicy(customer);
      expect(policy.canViewList()).toBe(false);
    });
  });

  describe("canView", () => {
    it("admin can view any order", () => {
      const admin = { role: "admin" };
      const policy = new OrderPolicy(admin);
      const order = { id: 1, location_id: 1 };
      expect(policy.canView(order)).toBe(true);
    });

    it("location manager can view orders in their scope", () => {
      const manager = { role: "location_manager", locationScopes: [1, 2] };
      const policy = new OrderPolicy(manager);
      const order = { id: 1, location_id: 1 };
      expect(policy.canView(order)).toBe(true);
    });

    it("location manager cannot view orders outside their scope", () => {
      const manager = { role: "location_manager", locationScopes: [1, 2] };
      const policy = new OrderPolicy(manager);
      const order = { id: 1, location_id: 3 };
      expect(policy.canView(order)).toBe(false);
    });

    it("product manager canView is false (checked via canViewAsync)", () => {
      const manager = { role: "product_manager", productScopes: [1] };
      const policy = new OrderPolicy(manager);
      const order = { id: 1, location_id: 1 };
      expect(policy.canView(order)).toBe(false);
    });
  });

  describe("canCreate", () => {
    it("admin can create orders", () => {
      const admin = { role: "admin" };
      const policy = new OrderPolicy(admin);
      expect(policy.canCreate()).toBe(true);
    });

    it("customer can create orders", () => {
      const customer = { role: "customer" };
      const policy = new OrderPolicy(customer);
      expect(policy.canCreate()).toBe(true);
    });

    it("location manager cannot create orders", () => {
      const manager = { role: "location_manager" };
      const policy = new OrderPolicy(manager);
      expect(policy.canCreate()).toBe(false);
    });
  });

  describe("canUpdate", () => {
    it("admin can update orders", () => {
      const admin = { role: "admin" };
      const policy = new OrderPolicy(admin);
      const order = { id: 1 };
      expect(policy.canUpdate(order)).toBe(true);
    });

    it("location manager cannot update orders", () => {
      const manager = { role: "location_manager", locationScopes: [1] };
      const policy = new OrderPolicy(manager);
      const order = { id: 1, location_id: 1 };
      expect(policy.canUpdate(order)).toBe(false);
    });
  });
});
