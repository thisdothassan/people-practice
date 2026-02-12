const db = require("../config/database");

class OrderPolicy {
    constructor(user) {
        this.user = user;
    }

    /** Customers can view own order list (filtered in service); admins (any manager type) can view list */
    canViewList() {
        return ["admin", "customer"].includes(
            this.user.role)
    }

    canView(order) {
        if (this.user.role === "customer") {
            return (
                this.user.customerId != null &&
                order.customer_id === this.user.customerId
            );
        }
        if (this.user.role === "admin") {
            if (this.user.type === "super") return true;
            if (this.user.type === "location") {
                return (
                    this.user.locationScopes &&
                    this.user.locationScopes.includes(order.location_id)
                );
            }
            return false;
        }
        return false;
    }

    async canViewAsync(order) {
        if (this.canView(order)) return true;
        if (this.user.role === "admin" && this.user.type === "product") {
            const query = `
                SELECT 1
                FROM order_items
                WHERE order_id = $1
                  AND product_id = ANY ($2) LIMIT 1
            `;
            const result = await db.query(query, [
                order.id,
                this.user.productScopes || [],
            ]);
            return result.rows.length > 0;
        }
        return false;
    }

    canCreate() {
        return ["admin", "customer"].includes(
            this.user.role)
    }

    /** Only super can update orders */
    canUpdate(order) {
        if (this.user.role !== "admin") return false;
        return this.user.type === "super";
    }
}

module.exports = OrderPolicy;
