import { model, Schema } from "mongoose";

const productSchema = new Schema({
    name: String,
    price: Number,
    amount: Number,
    categories: [String]
});

const Product = model('products', productSchema);

export default Product;