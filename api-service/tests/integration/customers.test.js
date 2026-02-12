const request = require("supertest");
const app = require("../../src/app");

describe("Customer Routes", () => {
  let adminToken;
  let locationManagerToken;
  let customerToken;

  beforeAll(async () => {
    // Get or create admin and get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "admin@ecommerce.com",
      password: "admin123",
    });
    if (loginRes.body.token) {
      adminToken = loginRes.body.token;
    }
    // If no admin, try register (tests may run without seed)
    if (!adminToken && loginRes.status !== 200) {
      await request(app).post("/api/auth/register").send({
        email: "admin-test@test.com",
        password: "admin123",
        role: "admin",
      });
      const r = await request(app).post("/api/auth/login").send({
        email: "admin-test@test.com",
        password: "admin123",
      });
      adminToken = r.body.token;
    }
  });

  describe("GET /api/customers", () => {
    it("returns 401 without token", async () => {
      await request(app).get("/api/customers").expect(401);
    });

    it("admin can fetch customers when authenticated", async () => {
      if (!adminToken) return;
      const res = await request(app)
        .get("/api/customers")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe("GET /api/customers/:id", () => {
    it("returns 401 without token", async () => {
      await request(app).get("/api/customers/1").expect(401);
    });
  });
});
