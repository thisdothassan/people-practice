const { ManagerRepository, UserRepository } = require("../repositories");
const { NotFoundError, ValidationError } = require("../utils");
const bcrypt = require("bcrypt");

class ManagerService {
  static async getManagers(filters = {}) {
    return ManagerRepository.findAll(filters);
  }

  static async getManagerById(managerId) {
    const manager = await ManagerRepository.findById(managerId);
    if (!manager) {
      throw new NotFoundError("Manager not found");
    }
    return manager;
  }

  static async createManager(managerData) {
    const existingUser = await UserRepository.findByEmail(managerData.email);
    if (existingUser) {
      throw new ValidationError("Email already exists");
    }
    const password_hash = await bcrypt.hash(managerData.password, 10);
    const newUser = await UserRepository.create({
      email: managerData.email,
      password_hash,
      role: "admin",
    });
    return ManagerRepository.create(newUser.id, managerData);
  }
}

module.exports = ManagerService;
