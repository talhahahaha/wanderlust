const Listing = require("../models/listing");


module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
        res.render("listings/index.ejs",{allListings});
    };


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
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
};

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the logged-in user
    await newListing.save();
    req.flash('success', 'Listing created successfully!'); // flash message
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist.');
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); // ... is used to spread the properties of the listing object
    req.flash('success', 'Listing updated successfully!'); // flash message
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!'); // flash message
    res.redirect("/listings");
};