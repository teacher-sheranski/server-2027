import { describe, expect, it } from "vitest";
import { orderSchema } from "../../validations/order.validation.js";

describe("orderSchema", () => {
    it("accepts an order with an address and valid product", () => {
        const { error } = orderSchema.validate({
            address: {
                city: "Tel Aviv",
            },
            products: [
                {
                    _id: "507f1f77bcf86cd799439011",
                    amount: 2,
                },
            ],
        });

        expect(error).toBeUndefined();
    });

    it("rejects orders with missing address fields or invalid products", () => {
        expect(orderSchema.validate({
            address: {},
            products: [
                {
                    _id: "invalid-id",
                    amount: 0,
                },
            ],
        }).error).toBeDefined();
    });
});
