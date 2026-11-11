import { isValidObjectId } from "mongoose";
import Product from "../models/product.model.js";
import { AppError } from "../utils/AppErrors.js";

export const getAllProducts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // ? פרמטרים לא חובה עם ערכי ברירת מחדל

    const products = await Product.find() // חיפוש באוסף
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await Product.find().countDocuments(); // מחזיר כמה מוצרים יש באוסף

    res.json({ data: products, total });
};

export const getProductById = async (req, res) => {
    const { id } = req.params; // פרמטרים חובה מזהי משאב

    if (!isValidObjectId(id)) {
        throw new AppError("product not found", 404, "not-found");
    }

    const product = await Product.findById(id);

    if (!product) {
        throw new AppError("product not found", 404, "not-found");
    }

    return res.json(product);
};

export const addProduct = async (req, res) => {
    // if (req.body.price > 0 && req.body.name.length >= 2)

    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
};

export const updateProduct = async (req, res) => {
    console.log(req.body);

    const { id } = req.params; // פרמטרים חובה מזהי משאב

    if (!isValidObjectId(id)) {
        throw new AppError("product not found", 404, "not-found");
    }

    const product = await Product.findByIdAndUpdate(id,
        {
            $set: req.body.x, // עדכון/הוספת שדה לאוביקט
            // $unset: { price: true }, // מחיקת השדה מחיר מוצר למוצר הנוכחי
            $addToSet: { categories: req.body.y }, // הוספת איבר למערך בלי כפולים
        },
        { new: true }); // יחזיר את האוביקט המעודכן

    if (!product) {
        throw new AppError("product not found", 404, "not-found");
    }

    return res.json(product);
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params; // פרמטרים חובה מזהי משאב

    if (!isValidObjectId(id)) {
        throw new AppError("product not found", 404, "not-found");
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw new AppError("product not found", 404, "not-found");
    }

    return res.status(204).json();
};