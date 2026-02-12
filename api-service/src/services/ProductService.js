const { ProductRepository } = require("../repositories");
const { NotFoundError } = require("../utils");

class ProductService {
  static async getProducts() {
    return ProductRepository.findAll();
  }

  static async createProduct(data) {
    return ProductRepository.create(data);
  }

  static async updateProduct(id, data) {
    const product = await ProductRepository.findById(id);
    if (!product) throw new NotFoundError("Product not found");
    return ProductRepository.update(id, data);
  }
}

module.exports = ProductService;
