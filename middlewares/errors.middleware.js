// טיפול בשגיאות
import { AppError } from "../utils/AppError.js";

// מידלוואר היחיד שמקבל 4 פרמטרים
// ולכן כל השגיאות ילכו אליו
// err - מתקבלת השגיאה שנזרקה בקונטרולר/במידלוואר אחר
export const errorHandler = (err, req, res, next) => {
    // err = { message, status, type }
    const { message = "", status = 500, type = "Server Error" } = err;

    // כאן קועים תבנית כללית לשגיאה
    // כדי שכל השגיאות ישלחו עם סטטוס מתאים או 500 כברירת מחדל
    return res.status(status).json({ error: { msg: message, type } });
};

export const pathNotFound = (req, res, next) => {
    throw new AppError(`${req.url} ${req.method} is not found`, 404, "page-not-found");
};