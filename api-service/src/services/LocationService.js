const { LocationRepository } = require("../repositories");
const { NotFoundError } = require("../utils");

class LocationService {
  /**
   * Returns locations visible to the user:
   * - Super admin: all locations
   * - Location manager: only locations in their scope
   * - Others (e.g. customer, product manager): empty
   */
  static async getAccessibleLocations(user) {
    if (user.role !== "admin") return [];
    if (user.type === "super") return LocationRepository.findAll();
    if (user.type === "location" && user.locationScopes?.length) {
      return LocationRepository.findAll(user.locationScopes);
    }
    return [];
  }

  static async getById(id) {
    const location = await LocationRepository.findById(id);
    if (!location) throw new NotFoundError("Location not found");
    return location;
  }

  static async createLocation(data) {
    return LocationRepository.create(data);
  }

  static async updateLocation(id, data) {
    const location = await LocationRepository.findById(id);
    if (!location) throw new NotFoundError("Location not found");
    return LocationRepository.update(id, data);
  }
}

module.exports = LocationService;
