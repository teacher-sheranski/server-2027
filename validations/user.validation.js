import Joi from "joi";

const strongPasswordSchema = Joi.string()
    .min(8)
    .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])/)
    .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base": "Password must include an uppercase letter, a lowercase letter, a number, and a special character",
    });

// sign in - התחברות של קיים
// {username, password}
export const signInSchema = Joi.object({
    // חובה אחד מבין השניים
    username: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().required(),
});

// register (sign up) - הרשמה של חדש
// {username, password, repeatPassword, address, phone}
export const registerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: strongPasswordSchema.required(),
    repeatPassword: Joi.string().valid(Joi.ref("password")).required(),
    address: Joi.string(),
    phone: Joi.string(),
});

// update password
// {password, repeatPassword}
export const updatePasswordSchema = Joi.object({
    password: strongPasswordSchema.required(),
    repeatPassword: Joi.string().valid(Joi.ref("password")).required(),
});