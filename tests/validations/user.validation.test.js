import { describe, expect, it } from "vitest";
import { registerSchema } from "../../validations/user.validation.js";

describe("registerSchema", () => {
    it("accepts matching strong passwords", () => {
        const { error } = registerSchema.validate({
            username: "test-user",
            email: "test@example.com",
            password: "StrongPass1!",
            repeatPassword: "StrongPass1!",
        });

        expect(error).toBeUndefined();
    });

    it("rejects weak or non-matching passwords", () => {
        const weakPassword = registerSchema.validate({
            username: "test-user",
            email: "test@example.com",
            password: "weak",
            repeatPassword: "weak",
        });
        const nonMatchingPassword = registerSchema.validate({
            username: "test-user",
            email: "test@example.com",
            password: "StrongPass1!",
            repeatPassword: "DifferentPass1!",
        });

        expect(weakPassword.error).toBeDefined();
        expect(nonMatchingPassword.error).toBeDefined();
    });
});
