import { describe, expect, it, vi } from "vitest";
import { errorHandler, pathNotFound } from "../../middlewares/errors.middleware.js";

describe("error middleware", () => {
    it("responds with the error status and JSON shape", () => {
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        errorHandler(
            { message: "Not found", status: 404, type: "not-found" },
            {},
            res,
            vi.fn(),
        );

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: { msg: "Not found", type: "not-found" },
        });
    });

    it("uses default error fields when they are missing", () => {
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        errorHandler(new Error("Unexpected"), {}, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: { msg: "Unexpected", type: "Server Error" },
        });
    });

    it("creates a 404 error for an unknown path", () => {
        expect(() => pathNotFound({ url: "/missing", method: "GET" }, {}, vi.fn()))
            .toThrowError(expect.objectContaining({
                message: "/missing GET is not found",
                status: 404,
                type: "page-not-found",
            }));
    });
});
