const db = require("../config/database");

class ProductRepository {
  static async findAll() {
    const query = `
      SELECT id, name, sku, product_line, price, created_at
      FROM products
      ORDER BY id ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, name, sku, product_line, price, created_at
      FROM products
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create(data) {
    const query = `
      INSERT INTO products (name, sku, product_line, price)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, sku, product_line, price, created_at
    `;
    const result = await db.query(query, [
      data.name,
      data.sku,
      data.product_line ?? null,
      data.price ?? null,
    ]);
    return result.rows[0];
  }

  static async update(id, data) {
    const updates = [];
    const values = [];
    let paramCount = 1;
    if (data.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.sku !== undefined) {
      updates.push(`sku = $${paramCount++}`);
      values.push(data.sku);
    }
    if (data.product_line !== undefined) {
      updates.push(`product_line = $${paramCount++}`);
      values.push(data.product_line);
    }
    if (data.price !== undefined) {
      updates.push(`price = $${paramCount++}`);
      values.push(data.price);
    }
    if (updates.length === 0) return this.findById(id);
    values.push(id);
    const query = `
      UPDATE products
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, name, sku, product_line, price, created_at
    `;
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }
}

module.exports = ProductRepository;
