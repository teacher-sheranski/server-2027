import Joi from "joi";

// sign in - התחברות של קיים
// {username, password}
export const signInSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

// register (sign up) - הרשמה של חדש
// {username, password, repeatPassword, address, phone}
export const registerSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    repeatPassword: Joi.string().valid(Joi.ref("password")).required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
});

// update password
// {password, repeatPassword}
export const updatePasswordSchema = Joi.object({
    password: Joi.string().required(),
    repeatPassword: Joi.string().valid(Joi.ref("password")).required(),
});