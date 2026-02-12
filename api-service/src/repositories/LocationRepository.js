const db = require("../config/database");

class LocationRepository {
  static async findAll(locationIds = null) {
    let query = `
      SELECT id, name, code, country, created_at
      FROM locations
    `;
    const params = [];
    if (locationIds && locationIds.length > 0) {
      query += ` WHERE id = ANY($1)`;
      params.push(locationIds);
    }
    query += ` ORDER BY id ASC`;
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, name, code, country, created_at
      FROM locations
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create(data) {
    const query = `
      INSERT INTO locations (name, code, country)
      VALUES ($1, $2, $3)
      RETURNING id, name, code, country, created_at
    `;
    const result = await db.query(query, [
      data.name,
      data.code,
      data.country ?? null,
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
    if (data.code !== undefined) {
      updates.push(`code = $${paramCount++}`);
      values.push(data.code);
    }
    if (data.country !== undefined) {
      updates.push(`country = $${paramCount++}`);
      values.push(data.country);
    }
    if (updates.length === 0) return this.findById(id);
    values.push(id);
    const query = `
      UPDATE locations
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, name, code, country, created_at
    `;
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }
}

module.exports = LocationRepository;
