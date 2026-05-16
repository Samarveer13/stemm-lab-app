/// <reference types="jest" />

// Email validation matching Firebase rules and app's client-side checks (register.tsx)
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation mirroring register.tsx: required + minimum 6 chars
function validatePassword(password) {
  if (!password || password.trim() === "") {
    return { valid: false, error: "Password is required" };
  }
  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters" };
  }
  return { valid: true };
}

describe("authService — Unit Tests", () => {

  describe("validateEmail", () => {

    it("accepts a valid email address", () => {
      expect(validateEmail("student@school.edu.au")).toBe(true);
    });

    it("rejects an email missing the @ symbol", () => {
      expect(validateEmail("notanemail.com")).toBe(false);
    });

    it("rejects an email with no domain after @", () => {
      expect(validateEmail("user@")).toBe(false);
    });

    it("rejects an empty email string", () => {
      expect(validateEmail("")).toBe(false);
    });

    it("rejects an email containing spaces", () => {
      expect(validateEmail("user @domain.com")).toBe(false);
    });

  });

  describe("validatePassword", () => {

    it("rejects an empty password", () => {
      const result = validatePassword("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Password is required");
    });

    it("rejects a whitespace-only password", () => {
      const result = validatePassword("   ");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Password is required");
    });

    it("rejects a password shorter than 6 characters", () => {
      const result = validatePassword("abc");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Password must be at least 6 characters");
    });

    it("accepts a valid password of 6 or more characters", () => {
      const result = validatePassword("securePass123");
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

  });

});
