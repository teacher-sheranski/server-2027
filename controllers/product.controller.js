import { isValidObjectId } from "mongoose";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query; // ? פרמטרים לא חובה עם ערכי ברירת מחדל

        const products = await Product.find() // חיפוש באוסף
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Product.find().countDocuments(); // מחזיר כמה מוצרים יש באוסף

        res.json({ data: products, total });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params; // פרמטרים חובה מזהי משאב

        if (!isValidObjectId(id))
            return res.status(404).json({ error: 'product not found' });

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'product not found' });
        }

        return res.json(product);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const addProduct = async (req, res, next) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params; // פרמטרים חובה מזהי משאב

        if (!isValidObjectId(id))
            return res.status(404).json({ error: 'product not found' });

        const product = await Product.findByIdAndUpdate(id,
            {
                $set: req.body.x, // עדכון/הוספת שדה לאוביקט
                // $unset: { price: true }, // מחיקת השדה מחיר מוצר למוצר הנוכחי
                $addToSet: { categories: req.body.y }, // הוספת איבר למערך בלי כפולים
            },
            { new: true }); // יחזיר את האוביקט המעודכן

        if (!product) {
            return res.status(404).json({ error: 'product not found' });
        }

        return res.json(product);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params; // פרמטרים חובה מזהי משאב

        if (!isValidObjectId(id))
            return res.status(404).json({ error: 'product not found' });

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ error: 'product not found' });
        }

        return res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: error });
    }
};