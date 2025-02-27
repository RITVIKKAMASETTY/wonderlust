import Joi from "joi";

export const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required()
});
