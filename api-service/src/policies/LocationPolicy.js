class LocationPolicy {
  constructor(user) {
    this.user = user;
  }

  /** Admin (super or location type) can view locations list; filtering by scope is done in service */
  canViewList() {
    return this.user.role === "admin";
  }

  canView(location) {
    if (this.user.role !== "admin") return false;
    if (this.user.type === "super") return true;
    if (this.user.type === "location" && this.user.locationScopes?.length) {
      return this.user.locationScopes.includes(location.id);
    }
    return false;
  }

  canCreate() {
    return this.user.role === "admin" && this.user.type === "super";
  }

  canUpdate(location) {
    return this.user.role === "admin" && this.user.type === "super";
  }
}

module.exports = LocationPolicy;
