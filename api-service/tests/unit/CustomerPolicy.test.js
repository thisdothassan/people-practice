const CustomerPolicy = require("../../src/policies/CustomerPolicy");

describe("CustomerPolicy", () => {
  describe("canViewList", () => {
    it("admin can view customer list", () => {
      const admin = { role: "admin" };
      const policy = new CustomerPolicy(admin);
      expect(policy.canViewList()).toBe(true);
    });

    it("location manager can view customer list", () => {
      const manager = { role: "location_manager", locationScopes: [1, 2] };
      const policy = new CustomerPolicy(manager);
      expect(policy.canViewList()).toBe(true);
    });

    it("product manager cannot view customer list", () => {
      const manager = { role: "product_manager", productScopes: [1] };
      const policy = new CustomerPolicy(manager);
      expect(policy.canViewList()).toBe(false);
    });

    it("customer cannot view customer list", () => {
      const customer = { role: "customer" };
      const policy = new CustomerPolicy(customer);
      expect(policy.canViewList()).toBe(false);
    });
  });

  describe("canView", () => {
    it("admin can view any customer", () => {
      const admin = { role: "admin" };
      const policy = new CustomerPolicy(admin);
      const customer = { location_id: 1 };
      expect(policy.canView(customer)).toBe(true);
    });

    it("location manager can view customers in their scope", () => {
      const manager = {
        role: "location_manager",
        locationScopes: [1, 2],
      };
      const policy = new CustomerPolicy(manager);
      const customer = { location_id: 1 };
      expect(policy.canView(customer)).toBe(true);
    });

    it("location manager cannot view customers outside their scope", () => {
      const manager = {
        role: "location_manager",
        locationScopes: [1, 2],
      };
      const policy = new CustomerPolicy(manager);
      const customer = { location_id: 3 };
      expect(policy.canView(customer)).toBe(false);
    });

    it("product manager cannot view customers", () => {
      const manager = {
        role: "product_manager",
        productScopes: [1],
      };
      const policy = new CustomerPolicy(manager);
      const customer = { location_id: 1 };
      expect(policy.canView(customer)).toBe(false);
    });
  });

  describe("canCreate", () => {
    it("admin can create customers", () => {
      const admin = { role: "admin" };
      const policy = new CustomerPolicy(admin);
      expect(policy.canCreate()).toBe(true);
    });

    it("location manager cannot create customers", () => {
      const manager = { role: "location_manager" };
      const policy = new CustomerPolicy(manager);
      expect(policy.canCreate()).toBe(false);
    });
  });

  describe("canUpdate", () => {
    it("admin can update any customer", () => {
      const admin = { role: "admin" };
      const policy = new CustomerPolicy(admin);
      const customer = { location_id: 1 };
      expect(policy.canUpdate(customer)).toBe(true);
    });

    it("location manager can update customers in their scope", () => {
      const manager = { role: "location_manager", locationScopes: [1] };
      const policy = new CustomerPolicy(manager);
      const customer = { location_id: 1 };
      expect(policy.canUpdate(customer)).toBe(true);
    });
  });

  describe("canDelete", () => {
    it("admin can delete customers", () => {
      const admin = { role: "admin" };
      const policy = new CustomerPolicy(admin);
      const customer = { location_id: 1 };
      expect(policy.canDelete(customer)).toBe(true);
    });

    it("location manager cannot delete customers", () => {
      const manager = { role: "location_manager", locationScopes: [1] };
      const policy = new CustomerPolicy(manager);
      const customer = { location_id: 1 };
      expect(policy.canDelete(customer)).toBe(false);
    });
  });
});
