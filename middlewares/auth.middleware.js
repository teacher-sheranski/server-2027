import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
// Authorization
// Authentication

// בדיקת הרשאות

// אם נכנסתי למערכת
export const auth = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [, token] = authorization.split(' ');

        const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';
        const user = jwt.verify(token, JWT_SECRET);

        // הוספנו את האוביקט של ההרשאות - קוד משתמש ותפקיד לאוביקט הבקשה
        req.userData = user; // { _id, role }
        // מעביר למידלוואר הבא
        next();
    } catch (error) {
        throw new AppError('auth invalid', 401, 'auth');
    }
};

// האם יש הרשאת מנהל
export const authAdmin = (req, res, next) => {
    if (req.userData.role !== 'admin') {
        // רשום למערכת עם הרשאה אחרת
        throw new AppError('auth invalid', 403, 'auth');
    }
    next();
};