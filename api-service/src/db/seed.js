require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../config/database");

async function seed() {
    // Run seed SQL (locations and products)
    const fs = require("fs");
    const path = require("path");
    const seedSql = fs.readFileSync(
        path.join(__dirname, "migrations", "002_seed_data.sql"),
        "utf8",
    );
    await db.query(seedSql);

    // Create admin user if not exists (password: admin123)
    const existing = await db.query(
        "SELECT id FROM users WHERE email IN ('admin@ecommerce.com', 'customer@ecommerce.com')",
    );

    if (existing.rows.length === 0) {
        const password_hash = await bcrypt.hash("admin123", 10);
        await db.query(
            `INSERT INTO users (email, password_hash, role)
             VALUES ($1, $2, 'admin')`,
            ["admin@ecommerce.com", password_hash],
        );
        await db.query(
            `INSERT INTO users (email, password_hash, role)
             VALUES ($1, $2, 'customer')`,
            ["customer@ecommerce.com", password_hash],
        );
        console.log(
            "Admin user created (email: admin@ecommerce.com, password: admin123)" +
            "Admin user created (email: customer@ecommerce.com, password: admin123)",
        );
    }
    console.log("Seed complete.");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
