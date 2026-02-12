require("dotenv").config();
const fs = require("fs");
const path = require("path");
const db = require("../config/database");

const migrationsDir = path.join(__dirname, "migrations");

async function runMigrations() {
    const files = fs
        .readdirSync(migrationsDir)
        .filter((f) => f.endsWith(".sql"))
        .sort();
    for (const file of files) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, "utf8");
        console.log(`Running migration: ${file}`);
        await db.query(sql);
    }
    console.log("Migrations complete.");
    process.exit(0);
}

runMigrations().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
