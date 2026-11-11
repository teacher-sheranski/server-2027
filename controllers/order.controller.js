import { isValidObjectId } from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { AppError } from "../utils/AppError.js";

export const getAllOrders = async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
        throw new AppError("page and limit must be positive integers", 400, "validation-error");
    }

    const [orders, total] = await Promise.all([
        Order.find().skip((page - 1) * limit).limit(limit),
        Order.countDocuments(),
    ]);

    return res.json({ data: orders, total });
};

export const getOrderById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new AppError("order not found", 404, "not-found");
    }

    // orders החזרת הנתונים מהאוסף של
    // const order = await Order.findById(id);

    // אם רוצים לצרף את האוספים
    // כלומר להחזיר לכל מוצר בהזמנה גם קטגוריה מטבלת מוצרים
    const order = await Order.findById(id)
        .populate('products._id', 'categories'); // תחבר את הטבלאות עבור השדה קוד מוצר

    if (!order) {
        throw new AppError("order not found", 404, "not-found");
    }

    return res.json(order);
};

export const addOrder = async (req, res) => {
    // יוצרת מערך עם כל הקודים של המוצרים שנשלחו ע"י המשתמש
    const productIds = req.body.products.map(({ _id }) => _id.toLowerCase());

    // מחזיר מערך מוצרים מהדטהבייס שזהים לקודים שנשלחו
    const products = await Product.find({ _id: { $in: productIds } });

    // TODO: לסדר את המוצרים שלא יהיו כפולים, לאחד עם amount
    const productsById = new Map(products.map((product) => [product.id.toLowerCase(), product]));

    if (productsById.size !== new Set(productIds).size) {
        throw new AppError("one or more products were not found", 404, "not-found");
    }

    // 1. אוביקט "באוויר" לא בדטהבייס
    const order = new Order({
        date: req.body.date ?? new Date(),
        address: req.body.address,
        products: req.body.products.map(({ _id, amount }) => {
            const product = productsById.get(_id.toLowerCase());
            return {
                _id: product._id,
                name: product.name,
                price: product.price,
                amount,
            };
        }),
    });

    // 2. שמירה בדטהבייס
    await order.save();

    return res.status(201).json(order);
};