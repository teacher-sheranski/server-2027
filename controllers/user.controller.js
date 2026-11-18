// hash    -> register, updatePassword
// compare -> login

import User from "../models/user.model.js";
import { AppError } from '../utils/AppError.js';
import { createToken } from "../utils/jwt.js";

// הרשמה
export const register = async (req, res, next) => {
    const user = new User(req.body);
    await user.save();

    const token = createToken(user);
    res.status(201).json({ username: user.username, token });
};

// התחברות
export const login = async (req, res, next) => {
    const user = await User.findOne({
        $or: [
            { email: req.body.email }, // אימייל קיים
            { username: req.body.username } // סיסמא קיימת
        ]
    });

    if (!user)
        throw new AppError('invalid username or password', 404);

    const result = await user.comparePassword(req.body.password);

    if (!result)
        throw new AppError('invalid username or password', 404);

    const token = createToken(user);

    // נחזיר רק נתונים רלוונטיים
    // לא נחזיר סיסמאות וכולי
    res.json({ username: user.username, token });
};

export const updatePassword = (req, res, next) => { };