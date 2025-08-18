const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require('../utils/wrapAsync.js'); 
const { reviewSchema } = require('../schema.js'); // Importing the Joi schema for validation
const Review = require('../models/review.js'); // Importing the Review model
const Listing = require('../models/listing.js'); // Importing the Listing model


//_______________________________________________________________________
// Joi middleware for reviews
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
//__________________________________________________
// Review routes
// Post route
router.post("/",validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review from listing
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router; // Export the router to use in app.js