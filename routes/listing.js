const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js'); // Importing the Listing model
const { isLoggedIn,isOwner, validateListing } = require('../middleware.js');



 

//_______________________________________________________________________________

// index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
        res.render("listings/index.ejs",{allListings});
    }));
    //____________________________________________________________
    // NEW LISTING ROUTE
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});
//________________________________________________keep new route up____________

//SHOW ROUTE 
router.get("/:id", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id)
    .populate({
        path:'reviews',
        populate: {
            path: 'author',
            model: 'User'
        }
    })
    .populate('owner');
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist.');
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}));
//___________________________________________________________________________________________

// CREATE LISTING ROUTE
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the logged-in user
    await newListing.save();
    req.flash('success', 'Listing created successfully!'); // flash message
    res.redirect("/listings");
}));
//___________________________________________________________________________________________
// EDIT LISTING ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist.');
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));
//___________________________________________________________________________________________
// update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); // ... is used to spread the properties of the listing object
    req.flash('success', 'Listing updated successfully!'); // flash message
    res.redirect(`/listings/${id}`);
}));
//___________________________________________________________________________________________

// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!'); // flash message
    res.redirect("/listings");
}));

module.exports = router;
