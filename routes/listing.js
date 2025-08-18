const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema.js'); // Importing the Joi schema for validation
const Listing = require('../models/listing.js'); // Importing the Listing model

 

//________________________________________________________________________
//joi middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
//_______________________________________________________________________________

// index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
        res.render("listings/index.ejs",{allListings});
    }));
    //____________________________________________________________
    // NEW LISTING ROUTE
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});
//________________________________________________keep new route up____________

//SHOW ROUTE 
router.get("/:id", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate('reviews');
    res.render("listings/show.ejs", { listing });
}));
//___________________________________________________________________________________________

// CREATE LISTING ROUTE
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));
//___________________________________________________________________________________________
// EDIT LISTING ROUTE
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));
//___________________________________________________________________________________________
// update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); // ... is used to spread the properties of the listing object
    res.redirect(`/listings/${id}`);
}));
//___________________________________________________________________________________________

// delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;
