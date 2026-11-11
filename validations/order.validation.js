import Joi from "joi";

// Order creation requires product IDs and quantities; product names and prices are read from the catalog.
export const orderSchema = Joi.object({
    date: Joi.date(),
    address: Joi.object({
        city: Joi.string().required(),
        street: Joi.string(),
        num: Joi.number(),
    }).required(),
    products: Joi.array().items(
        Joi.object({
            _id: Joi.string().hex().length(24).required(),
            name: Joi.string(),
            amount: Joi.number().integer().positive().required(),
        })
    ).min(1).required(),
});
