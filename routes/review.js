const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require('../utils/wrapAsync.js'); 
const Review = require('../models/review.js'); // Importing the Review model
const Listing = require('../models/listing.js'); // Importing the Listing model
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');


//controller for reviews_______________________________________
const reviewController = require('../controllers/reviews.js');
//__________________________________________________
// Review routes
// Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Review route
router.delete("/:reviewId", isReviewAuthor, isLoggedIn, wrapAsync(reviewController.destroyReview));

module.exports = router; // Export the router to use in app.js