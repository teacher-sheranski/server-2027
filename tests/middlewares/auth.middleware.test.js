import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("jsonwebtoken", () => ({
    default: {
        verify: vi.fn(),
    },
}));

import jwt from "jsonwebtoken";
import { auth, authAdmin } from "../../middlewares/auth.middleware.js";

describe("auth middleware", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("verifies the bearer token and attaches the user to the request", () => {
        const user = { _id: "user-1", role: "user" };
        jwt.verify.mockReturnValue(user);
        const req = { headers: { authorization: "Bearer valid-token" } };
        const next = vi.fn();

        auth(req, {}, next);

        expect(jwt.verify).toHaveBeenCalledWith("valid-token", expect.any(String));
        expect(req.userData).toBe(user);
        expect(next).toHaveBeenCalledOnce();
    });

    it("rejects invalid authentication", () => {
        jwt.verify.mockImplementation(() => {
            throw new Error("invalid token");
        });

        expect(() => auth(
            { headers: { authorization: "Bearer invalid-token" } },
            {},
            vi.fn(),
        )).toThrowError(expect.objectContaining({
            message: "auth invalid",
            status: 401,
            type: "auth",
        }));
    });
});

describe("authAdmin middleware", () => {
    it("continues for an admin", () => {
        const next = vi.fn();

        authAdmin({ userData: { role: "admin" } }, {}, next);

        expect(next).toHaveBeenCalledOnce();
    });

    it("rejects a non-admin user", () => {
        expect(() => authAdmin(
            { userData: { role: "user" } },
            {},
            vi.fn(),
        )).toThrowError(expect.objectContaining({
            message: "auth invalid",
            status: 403,
            type: "auth",
        }));
    });
});
