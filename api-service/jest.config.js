module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/app.js",
    "!src/db/migrate.js",
    "!src/db/seed.js",
  ],
  coverageDirectory: "coverage",
  verbose: true,
};
