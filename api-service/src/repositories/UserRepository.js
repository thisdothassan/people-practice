const db = require("../config/database");

class UserRepository {
  static async findByIdWithScopes(userId) {
    const userQuery = `
      SELECT u.id, u.email, u.role, u.is_active,
             m.id as manager_id, m.type
      FROM users u
      LEFT JOIN managers m ON u.id = m.user_id
      WHERE u.id = $1
    `;

    const result = await db.query(userQuery, [userId]);
    if (result.rows.length === 0) return null;

    const user = result.rows[0];

    // Fetch scopes if user is a manager (admin role)
    if (user.manager_id) {
      if (user.type === "location") {
        const scopeQuery = `
          SELECT location_id FROM manager_location_scopes 
          WHERE manager_id = $1
        `;
        const scopes = await db.query(scopeQuery, [user.manager_id]);
        user.locationScopes = scopes.rows.map((r) => r.location_id);
      } else if (user.type === "product") {
        const scopeQuery = `
          SELECT product_id FROM manager_product_scopes 
          WHERE manager_id = $1
        `;
        const scopes = await db.query(scopeQuery, [user.manager_id]);
        user.productScopes = scopes.rows.map((r) => r.product_id);
      }
    }

    // When role is customer, attach customer id for resource checks (e.g. own order)
    if (user.role === "customer") {
      const cust = await db.query(
        "SELECT id FROM customers WHERE user_id = $1",
        [user.id],
      );
      if (cust.rows[0]) user.customerId = cust.rows[0].id;
    }

    return user;
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  /** Returns manager type ('super' | 'location' | 'product') for admin users, or null */
  static async getManagerTypeByUserId(userId) {
    const query = `
      SELECT m.type FROM managers m
      WHERE m.user_id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0]?.type ?? null;
  }

  static async create(userData) {
    const query = `
      INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role, created_at
    `;
    const result = await db.query(query, [
      userData.email,
      userData.password_hash,
      userData.role,
    ]);
    return result.rows[0];
  }
}

module.exports = UserRepository;
