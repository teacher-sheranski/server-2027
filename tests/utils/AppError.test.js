import { describe, expect, it } from "vitest";
import { AppError } from "../../utils/AppError.js";

describe("AppError", () => {
    it("stores the message and default error details", () => {
        const error = new AppError("Something went wrong");

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Something went wrong");
        expect(error.status).toBe(500);
        expect(error.type).toBe("Server Error");
    });

    it("stores custom status and type", () => {
        const error = new AppError("Not found", 404, "Not Found");

        expect(error.status).toBe(404);
        expect(error.type).toBe("Not Found");
    });
});
