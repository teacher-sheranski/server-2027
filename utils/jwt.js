import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// פונקציה שיוצרת טוקן לפי נתוני הרשאה
export const createToken = ({ _id, role }) => {
    const payload = { userId: _id, role };
    const JWT_SECRET = env.JWT_SECRET;
    const token = jwt.sign(payload, JWT_SECRET);
    return token;
};