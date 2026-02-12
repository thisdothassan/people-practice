class CustomerPolicy {
  constructor(user) {
    this.user = user;
  }

  /** Admin with type super or location can view customer list; location is scoped in service */
  canViewList() {
    if (this.user.role === "customer") return false;
    if (this.user.role === "admin") {
      return this.user.type === "super" || this.user.type === "location";
    }
    return false;
  }

  canView(customer) {
    if (this.user.role === "customer") return false;
    if (this.user.role === "admin") {
      if (this.user.type === "super") return true;
      if (this.user.type === "location") {
        return (
          this.user.locationScopes &&
          this.user.locationScopes.includes(customer.location_id)
        );
      }
      // product type cannot view customers
      return false;
    }
    return false;
  }

  /** Only super manager can create customers */
  canCreate() {
    if (this.user.role !== "admin") return false;
    return this.user.type === "super";
  }

  canUpdate(customer) {
    return this.canView(customer);
  }

  canDelete(customer) {
    if (this.user.role !== "admin") return false;
    return this.user.type === "super";
  }
}

module.exports = CustomerPolicy;
