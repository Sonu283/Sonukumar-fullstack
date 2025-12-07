const jwt = require("jsonwebtoken");

describe("Authentication Tests", () => {
  const JWT_SECRET = process.env.JWT_SECRET || "test_secret";

  describe("JWT Token Generation", () => {
    test("should generate a valid JWT token", () => {
      const payload = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "customer"
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    test("should verify and decode a valid JWT token", () => {
      const payload = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "customer"
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
      const decoded = jwt.verify(token, JWT_SECRET);

      expect(decoded.id).toBe(1);
      expect(decoded.name).toBe("Test User");
      expect(decoded.email).toBe("test@example.com");
      expect(decoded.role).toBe("customer");
    });

    test("should have admin role in token when admin signup", () => {
      const adminPayload = {
        id: 2,
        name: "Admin User",
        email: "admin@example.com",
        role: "admin"
      };

      const token = jwt.sign(adminPayload, JWT_SECRET, { expiresIn: "7d" });
      const decoded = jwt.verify(token, JWT_SECRET);

      expect(decoded.role).toBe("admin");
    });

    test("should reject invalid or expired tokens", () => {
      const payload = {
        id: 1,
        name: "Test User"
      };

      const invalidSecret = "wrong_secret";
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      expect(() => {
        jwt.verify(token, invalidSecret);
      }).toThrow();
    });
  });

  describe("Password Hashing", () => {
    const bcrypt = require("bcryptjs");

    test("should hash a password", async () => {
      const password = "testPassword123";
      const hashedPassword = await bcrypt.hash(password, 10);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
    });

    test("should compare password with hash", async () => {
      const password = "testPassword123";
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(password, hashedPassword);

      expect(isMatch).toBe(true);
    });

    test("should return false for incorrect password", async () => {
      const password = "testPassword123";
      const wrongPassword = "wrongPassword";
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(wrongPassword, hashedPassword);

      expect(isMatch).toBe(false);
    });
  });
});
