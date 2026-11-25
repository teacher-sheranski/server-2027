import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../models/order.model.js", () => ({
    default: vi.fn(),
}));
vi.mock("../../models/product.model.js", () => ({
    default: vi.fn(),
}));

import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import { addOrder } from "../../controllers/order.controller.js";

describe("addOrder", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates an order using product details from the catalog", async () => {
        const product = {
            id: "507f1f77bcf86cd799439011",
            _id: "507f1f77bcf86cd799439011",
            name: "Chair",
            price: 25,
        };
        const order = {};
        const save = vi.fn().mockResolvedValue(undefined);
        Product.find = vi.fn().mockResolvedValue([product]);
        Order.mockImplementation(function (data) {
            Object.assign(this, data, order, { save });
        });

        const req = {
            body: {
                address: { city: "Tel Aviv" },
                products: [{ _id: product.id, amount: 2 }],
            },
            userData: { _id: "user-1" },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        await addOrder(req, res);

        expect(Order).toHaveBeenCalledWith(expect.objectContaining({
            userId: "user-1",
            address: req.body.address,
            products: [{
                _id: product._id,
                name: product.name,
                price: product.price,
                amount: 2,
            }],
        }));
        expect(save).toHaveBeenCalledOnce();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            userId: "user-1",
            products: [{
                _id: product._id,
                name: product.name,
                price: product.price,
                amount: 2,
            }],
        }));
    });

    it("rejects an order when a requested product is missing", async () => {
        Product.find = vi.fn().mockResolvedValue([]);

        const req = {
            body: {
                address: { city: "Tel Aviv" },
                products: [{ _id: "507f1f77bcf86cd799439011", amount: 1 }],
            },
            userData: { _id: "user-1" },
        };

        await expect(addOrder(req, {})).rejects.toMatchObject({
            status: 404,
            type: "not-found",
        });
        expect(Order).not.toHaveBeenCalled();
    });
});
