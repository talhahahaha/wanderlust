const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js'); // Importing the Listing model
const { isLoggedIn,isOwner, validateListing } = require('../middleware.js');


// controllers________________________________________
 const listingController = require('../controllers/listings.js');

//_______________________________________________________________________________

// create and index route
router
.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn,
     validateListing,
      wrapAsync(listingController.createListing)
);

// NEW LISTING ROUTE
router.get("/new", isLoggedIn,(listingController.renderNewForm));
//________________________________________________keep new route up____________


// SHOW , UPDATE, DELETE ROUTE
router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



// EDIT LISTING ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));




module.exports = router;
