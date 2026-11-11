
import { AppError } from "../utils/AppErrors.js";


// middleware creator
// Joi בדיקות תקינות על הבאדי ע"י
// המידלוואר הזה מתאים כרגע רק להוספת מוצר
// נרצה לעשות את המידלוואר שיתאים לכל הסכמות שנשלח לו
export const validateBody = (schema) => {
    // מקבל את הסכמה מבחוץ
    // ויוצר מידלוואר שמתאים לסכמה
    const mdl = (req, res, next) => {
        // validate - בדיקת התאמה לסכמה הנל
        // error - כל השגיאות שחזרו, אם חזרו
        // value - האוביקט אחרי הבדיקות וההמרות אם תקין
        // כברירת מחדל עוצד בשגיאה הראשונה, אם רוצים אפשר להחזיר את כל השגיאות
        const { error, value } = schema.validate(req.body);

        if (error) {
            throw new AppError(error.message, 409, "validation-error");
        } else {
            // עדכון הבאדי לאחר ההמרה
            req.body = value;
            // אוביקט תקין תמשיך לקונטרולר
            next();
        }
    };

    return mdl;
};