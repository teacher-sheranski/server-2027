import { describe, expect, it } from "vitest";
import { productSchema } from "../../validations/product.validation.js";

describe("productSchema", () => {
    it("accepts a valid product and applies defaults", () => {
        const { error, value } = productSchema.validate({
            name: "CHAIR",
            price: 25,
        });

        expect(error).toBeUndefined();
        expect(value).toEqual({
            name: "chair",
            price: 25,
            amount: 0,
        });
    });

    it("rejects a product without a name or with a negative price", () => {
        expect(productSchema.validate({ price: -1 }).error).toBeDefined();
    });
});
