import Joi from "joi";

// כל הסכמות שקשורות למוצרים

// יכול להיות כמה סכמות
export const productSchema = Joi.object({
    name: Joi.string().lowercase().required(), // מחרוזת, שדה חובה
    price: Joi.number().positive(), // מספר חיובי
    amount: Joi.number().integer().positive().default(0), // מספר שלם חיובי, ברירת מחדל אפס
    // categories: Joi.array(Joi.string().min(3)).max(2), // בתוך המערך כל מחרוזת באורך מינימלי 3' המערך באורך מקסימלי 2
});