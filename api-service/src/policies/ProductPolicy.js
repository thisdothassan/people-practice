class ProductPolicy {
  constructor(user) {
    this.user = user;
  }

  canCreate() {
    return this.user.role === "admin" && this.user.type === "super";
  }

  canUpdate(product) {
    return this.user.role === "admin" && this.user.type === "super";
  }
}

module.exports = ProductPolicy;
