import { model, Schema, SchemaTypes } from "mongoose";

const orderSchema = new Schema({
    date: Date,

    // 1. Embedded Documents - מסמכים משובצים
    //    כשיש נתונים שבד"כ קוראים אותם יחד
    address: {
        city: { type: String, required: true },
        street: String,
        num: Number
    },

    // 2. references - SQL כמו
    //    מערך של איי-די של מוצרים
    //    כדי שידע לקשר בין האוספים, צריך לכתוב ברף מאיזה אוסף מגיע
    // products: [{ type: SchemaTypes.ObjectId, ref: 'products' }]

    // 3. 1 + 2
    products: [{
        _id: {type: SchemaTypes.ObjectId, ref: 'products'},
        name: String,
        price: Number,
        amount: Number,
        // categories: [String] // לא צריכים כשצופים בהזמנה
    }]
});

const Order = model('orders', orderSchema);

export default Order;