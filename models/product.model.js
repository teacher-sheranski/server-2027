import { model, Schema } from "mongoose";

// תבנית של אוביקט
const productSchema = new Schema({
    name: String,
    price: Number,
    amount: Number,
    categories: [String],
    img: String
});

// הגדרות על האוסף
const Product = model('products', productSchema);

export default Product;