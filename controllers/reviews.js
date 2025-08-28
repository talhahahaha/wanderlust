const Review = require('../models/review.js'); // Importing the Review model
const Listing = require('../models/listing.js'); // Importing the Listing model





module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Associate review with logged-in user

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash('success', 'Review added successfully!'); // flash message
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review from listing
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!'); // flash message
    res.redirect(`/listings/${id}`);
};