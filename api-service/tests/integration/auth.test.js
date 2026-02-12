const request = require("supertest");
const app = require("../../src/app");

describe("Auth Routes", () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: "password123",
    role: "customer",
  };

  describe("POST /api/auth/register", () => {
    it("registers a new user and returns user and token", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(201);
      expect(res.body).toHaveProperty("user");
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.role).toBe(testUser.role);
    });

    it("returns 400 when email already exists", async () => {
      await request(app).post("/api/auth/register").send(testUser).expect(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("logs in and returns user and token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe(testUser.email);
    });

    it("returns 401 for invalid credentials", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: "wrongpassword" })
        .expect(401);
    });
  });
});
