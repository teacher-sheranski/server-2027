import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../models/product.model.js", () => ({
    default: vi.fn(),
}));

import Product from "../../models/product.model.js";
import { addProduct, getProductById } from "../../controllers/product.controller.js";

describe("product controller", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("saves a new product and responds with status 201", async () => {
        const product = { name: "Chair" };
        const save = vi.fn().mockResolvedValue(undefined);
        Product.mockImplementation(function (data) {
            Object.assign(this, data, { save });
        });
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        await addProduct({ body: { name: "Chair" } }, res);

        expect(Product).toHaveBeenCalledWith({ name: "Chair" });
        expect(save).toHaveBeenCalledOnce();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining(product));
    });

    it("returns a not-found error for an invalid product ID without querying", async () => {
        Product.findById = vi.fn();

        await expect(getProductById({ params: { id: "invalid-id" } }, {}))
            .rejects.toMatchObject({ status: 404, type: "not-found" });

        expect(Product.findById).not.toHaveBeenCalled();
    });

    it("returns a not-found error when the product does not exist", async () => {
        Product.findById = vi.fn().mockResolvedValue(null);

        await expect(getProductById(
            { params: { id: "507f1f77bcf86cd799439011" } },
            {},
        )).rejects.toMatchObject({ status: 404, type: "not-found" });
    });
});
