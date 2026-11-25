import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../models/user.model.js", () => ({
    default: vi.fn(),
}));
vi.mock("../../utils/jwt.js", () => ({
    createToken: vi.fn(),
}));

import User from "../../models/user.model.js";
import { login, register } from "../../controllers/user.controller.js";
import { createToken } from "../../utils/jwt.js";

describe("user controller", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("registers a user and returns a token", async () => {
        const save = vi.fn().mockResolvedValue(undefined);
        const req = {
            body: { username: "test-user", email: "test@example.com" },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        User.mockImplementation(function (data) {
            Object.assign(this, data, { save });
        });
        createToken.mockReturnValue("signed-token");

        await register(req, res, vi.fn());

        expect(save).toHaveBeenCalledOnce();
        expect(createToken).toHaveBeenCalledOnce();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            username: "test-user",
            token: "signed-token",
        });
    });

    it("logs in a user with a valid password", async () => {
        const user = {
            username: "test-user",
            comparePassword: vi.fn().mockResolvedValue(true),
        };
        User.findOne = vi.fn().mockResolvedValue(user);
        createToken.mockReturnValue("signed-token");
        const res = { json: vi.fn() };
        const req = {
            body: {
                username: "test-user",
                email: "test@example.com",
                password: "StrongPass1!",
            },
        };

        await login(req, res, vi.fn());

        expect(User.findOne).toHaveBeenCalledWith({
            $or: [
                { email: "test@example.com" },
                { username: "test-user" },
            ],
        });
        expect(user.comparePassword).toHaveBeenCalledWith("StrongPass1!");
        expect(res.json).toHaveBeenCalledWith({
            username: "test-user",
            token: "signed-token",
        });
    });

    it("rejects login when the password does not match", async () => {
        User.findOne = vi.fn().mockResolvedValue({
            comparePassword: vi.fn().mockResolvedValue(false),
        });

        await expect(login(
            { body: { username: "test-user", password: "wrong" } },
            {},
            vi.fn(),
        )).rejects.toMatchObject({
            message: "invalid username or password",
            status: 404,
        });
        expect(createToken).not.toHaveBeenCalled();
    });
});
