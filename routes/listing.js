const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js'); // Importing the Listing model
const { isLoggedIn,isOwner, validateListing } = require('../middleware.js');


// controllers________________________________________
 const listingController = require('../controllers/listings.js');

//_______________________________________________________________________________

// index route
router.get("/",wrapAsync(listingController.index));
    //____________________________________________________________
    // NEW LISTING ROUTE
router.get("/new", isLoggedIn,(listingController.renderNewForm));
//________________________________________________keep new route up____________

//SHOW ROUTE 
router.get("/:id", wrapAsync(listingController.showListing));
//___________________________________________________________________________________________

// CREATE LISTING ROUTE
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));
//___________________________________________________________________________________________
// EDIT LISTING ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
//___________________________________________________________________________________________
// update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));
//___________________________________________________________________________________________

// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
