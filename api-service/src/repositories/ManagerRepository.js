const db = require("../config/database");

class ManagerRepository {
    static async findById(id) {
        const query = `
            SELECT m.*, u.email, u.role
            FROM managers m
                     JOIN users u ON m.user_id = u.id
            WHERE m.id = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByUserId(userId) {
        const query = `
            SELECT m.*, u.email, u.role
            FROM managers m
                     JOIN users u ON m.user_id = u.id
            WHERE m.user_id = $1
        `;
        const result = await db.query(query, [userId]);
        return result.rows[0] || null;
    }

    static async create(userId, managerData) {
        const client = await db.getClient();
        try {
            await client.query("BEGIN");
            const managerQuery = `
                INSERT INTO managers (user_id, type)
                VALUES ($1, $2) RETURNING *
            `;
            const managerResult = await client.query(managerQuery, [
                userId,
                managerData.type,
            ]);
            const manager = managerResult.rows[0];

            if (
                managerData.type === "location" &&
                managerData.location_ids?.length
            ) {
                for (const locationId of managerData.location_ids) {
                    await client.query(
                        `INSERT INTO manager_location_scopes (manager_id, location_id)
                         VALUES ($1, $2)`,
                        [manager.id, locationId],
                    );
                }
            } else if (
                managerData.type === "product" &&
                managerData.product_ids?.length
            ) {
                for (const productId of managerData.product_ids) {
                    await client.query(
                        `INSERT INTO manager_product_scopes (manager_id, product_id)
                         VALUES ($1, $2)`,
                        [manager.id, productId],
                    );
                }
            }

            await client.query("COMMIT");
            return {...manager, user_id: userId};
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    static async findAll(filters = {}) {
        let query = `
            SELECT m.*, u.email, u.role
            FROM managers m
                     JOIN users u ON m.user_id = u.id
            WHERE 1 = 1
        `;
        const params = [];
        let paramCount = 1;

        if (filters.type) {
            query += ` AND m.type = $${paramCount}`;
            params.push(filters.type);
            paramCount++;
        }

        query += " ORDER BY m.created_at DESC";
        const result = await db.query(query, params);
        return result.rows;
    }
}

module.exports = ManagerRepository;
