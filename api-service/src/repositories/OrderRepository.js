const db = require("../config/database");

class OrderRepository {
    static async findAll(filters = {}) {
        let query = `
            SELECT DISTINCT o.*, c.first_name, c.last_name, l.name as location_name
            FROM orders o
                     JOIN customers c ON o.customer_id = c.id
                     JOIN locations l ON o.location_id = l.id
        `;

        const params = [];
        let paramCount = 1;
        const whereClauses = [];

        // Customer filter (for customer role - own orders only)
        if (filters.customerId) {
            whereClauses.push(`o.customer_id = $${paramCount}`);
            params.push(filters.customerId);
            paramCount++;
        }

        // Location scope filter
        if (filters.locationIds && filters.locationIds.length > 0) {
            whereClauses.push(`o.location_id = ANY($${paramCount})`);
            params.push(filters.locationIds);
            paramCount++;
        }

        // Product scope filter (requires join with order_items)
        if (filters.productIds && filters.productIds.length > 0) {
            query += ` JOIN order_items oi ON o.id = oi.order_id`;
            whereClauses.push(`oi.product_id = ANY($${paramCount})`);
            params.push(filters.productIds);
            paramCount++;
        }

        if (whereClauses.length > 0) {
            query += ` WHERE ${whereClauses.join(" AND ")}`;
        }

        query += " ORDER BY o.created_at DESC";

        const result = await db.query(query, params);
        return result.rows;
    }

    static async findById(id) {
        const query = `
            SELECT o.*,
                   c.first_name,
                   c.last_name,
                   l.name as location_name,
                   json_agg(
                           json_build_object(
                                   'id', oi.id,
                                   'product_id', oi.product_id,
                                   'product_name', p.name,
                                   'quantity', oi.quantity,
                                   'price', oi.price
                           )
                   )         FILTER (WHERE oi.id IS NOT NULL) as items
            FROM orders o
                     JOIN customers c ON o.customer_id = c.id
                     JOIN locations l ON o.location_id = l.id
                     LEFT JOIN order_items oi ON o.id = oi.order_id
                     LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.id = $1
            GROUP BY o.id, c.first_name, c.last_name, l.name
        `;
        const result = await db.query(query, [id]);
        const row = result.rows[0];
        if (!row) return null;
        row.items =
            row.items == null
                ? []
                : Array.isArray(row.items)
                    ? row.items
                    : [row.items];
        return row;
    }

    static async create(orderData) {
        const client = await db.getClient();

        try {
            await client.query("BEGIN");

            const orderQuery = `
                INSERT INTO orders (customer_id, location_id, status, total_amount)
                VALUES ($1, $2, $3, $4) RETURNING *
            `;
            const orderResult = await client.query(orderQuery, [
                orderData.customer_id,
                orderData.location_id,
                orderData.status || "pending",
                orderData.total_amount,
            ]);
            const order = orderResult.rows[0];

            if (orderData.items && orderData.items.length > 0) {
                const itemQuery = `
                    INSERT INTO order_items (order_id, product_id, quantity, price)
                    VALUES ($1, $2, $3, $4)
                `;
                for (const item of orderData.items) {
                    await client.query(itemQuery, [
                        order.id,
                        item.product_id,
                        item.quantity,
                        item.price,
                    ]);
                }
            }

            await client.query("COMMIT");
            return order;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = OrderRepository;
