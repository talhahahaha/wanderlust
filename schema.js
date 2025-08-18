const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().allow(null, ''),
        country: Joi.string().required(),
    }).required(),
});
// joi is a validation library for JavaScript objects that helps in validating and parsing data structures.

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required(),
});