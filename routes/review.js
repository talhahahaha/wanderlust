const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require('../utils/wrapAsync.js'); 
const Review = require('../models/review.js'); // Importing the Review model
const Listing = require('../models/listing.js'); // Importing the Listing model
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');


//__________________________________________________
// Review routes
// Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Associate review with logged-in user

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash('success', 'Review added successfully!'); // flash message
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review route
router.delete("/:reviewId", isReviewAuthor, isLoggedIn, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review from listing
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!'); // flash message
    res.redirect(`/listings/${id}`);
}));

module.exports = router; // Export the router to use in app.js