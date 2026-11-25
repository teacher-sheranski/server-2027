import { describe, expect, it, vi } from "vitest";
import { validateBody } from "../../middlewares/validateJoi.middleware.js";
import { AppError } from "../../utils/AppError.js";
import { productSchema } from "../../validations/product.validation.js";

describe("validateBody", () => {
    it("replaces the request body with Joi's normalized value", () => {
        const req = { body: { name: "CHAIR", price: 25 } };
        const next = vi.fn();

        validateBody(productSchema)(req, {}, next);

        expect(req.body).toEqual({ name: "chair", price: 25, amount: 0 });
        expect(next).toHaveBeenCalledOnce();
    });

    it("throws a validation error and does not continue for invalid input", () => {
        const req = { body: { price: -1 } };
        const next = vi.fn();
        let thrownError;

        try {
            validateBody(productSchema)(req, {}, next);
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).toBeInstanceOf(AppError);
        expect(thrownError).toMatchObject({ status: 409, type: "validation-error" });
        expect(next).not.toHaveBeenCalled();
    });
});
