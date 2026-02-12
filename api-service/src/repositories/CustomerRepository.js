const db = require("../config/database");

class CustomerRepository {
  static async findAll(filters = {}) {
    let query = `
      SELECT c.*, u.email, l.name as location_name
      FROM customers c
      JOIN users u ON c.user_id = u.id
      JOIN locations l ON c.location_id = l.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // Apply location scope filter
    if (filters.locationIds && filters.locationIds.length > 0) {
      query += ` AND c.location_id = ANY($${paramCount})`;
      params.push(filters.locationIds);
      paramCount++;
    }

    query += " ORDER BY c.created_at DESC";

    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT c.*, u.email, l.name as location_name
      FROM customers c
      JOIN users u ON c.user_id = u.id
      JOIN locations l ON c.location_id = l.id
      WHERE c.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findByUserId(userId) {
    const query = `
      SELECT c.*, u.email, l.name as location_name
      FROM customers c
      JOIN users u ON c.user_id = u.id
      JOIN locations l ON c.location_id = l.id
      WHERE c.user_id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0] || null;
  }

  static async create(userId, customerData) {
    const client = await db.getClient();

    try {
      await client.query("BEGIN");
      const customerQuery = `
        INSERT INTO customers (user_id, location_id, first_name, last_name, shipping_address, billing_address, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const customerResult = await client.query(customerQuery, [
        userId,
        customerData.location_id,
        customerData.first_name,
        customerData.last_name,
        customerData.shipping_address,
        customerData.billing_address,
        customerData.phone,
      ]);

      await client.query("COMMIT");
      return customerResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(id, updates) {
    const allowedFields = [
      "first_name",
      "last_name",
      "shipping_address",
      "billing_address",
      "phone",
      "location_id",
    ];
    const setClause = [];
    const params = [];
    let paramCount = 1;

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = $${paramCount}`);
        params.push(updates[key]);
        paramCount++;
      }
    });

    if (setClause.length === 0) {
      throw new Error("No valid fields to update");
    }

    params.push(id);
    const query = `
      UPDATE customers 
      SET ${setClause.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, params);
    return result.rows[0];
  }
}

module.exports = CustomerRepository;
