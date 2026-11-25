import jwt from 'jsonwebtoken';

// פונקציה שיוצרת טוקן לפי נתוני הרשאה
export const createToken = ({ _id, role }) => {
    const payload = { userId: _id, role };
    const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';
    const token = jwt.sign(payload, JWT_SECRET);
    return token;
};