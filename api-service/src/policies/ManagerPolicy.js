class ManagerPolicy {
  constructor(user) {
    this.user = user;
  }

  canViewList() {
    return this.user.role === "admin" && this.user.type === "super";
  }

  canView(manager) {
    return this.user.role === "admin" && this.user.type === "super";
  }

  canCreate() {
    return this.user.role === "admin" && this.user.type === "super";
  }
}

module.exports = ManagerPolicy;
