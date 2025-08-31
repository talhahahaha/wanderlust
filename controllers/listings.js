
const Listing = require("../models/listing");
const axios = require("axios");


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
            path: 'reviews',
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
    // Pass coordinates and API key for map
    const coordinates = listing.geometry && listing.geometry.coordinates ? listing.geometry.coordinates : [0, 0];
    res.render("listings/show.ejs", {
        listing,
        coordinates,
        mapsApiKey: process.env.GEOAPIFY_KEY
    });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the logged-in user
    newListing.image = { url, filename };

    // Geocode the location using Geoapify
    try {
        const geoRes = await axios.get('https://api.geoapify.com/v1/geocode/search', {
            params: {
                text: newListing.location,
                apiKey: process.env.GEOAPIFY_KEY
            }
        });
        const features = geoRes.data.features;
        if (features && features.length > 0) {
            newListing.geometry = {
                type: 'Point',
                coordinates: features[0].geometry.coordinates // [lng, lat]
            };
        }
    } catch (err) {
        console.error('Geocoding failed:', err.message);
        newListing.geometry = { type: 'Point', coordinates: [0, 0] };
    }

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
    let originalImage = listing.image.url;
    originalImageUrl = originalImage.replace("/upload", "/upload/w_300");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true }); // ... is used to spread the properties of the listing object

    if(typeof req.file !== 'undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
 // geo code for update listing
    if (req.body.listing.location) {
    try {
        const geoRes = await axios.get('https://api.geoapify.com/v1/geocode/search', {
            params: {
                text: req.body.listing.location,
                apiKey: process.env.GEOAPIFY_KEY
            }
        });
        const features = geoRes.data.features;
        if (features && features.length > 0) {
            listing.geometry = {
                type: 'Point',
                coordinates: features[0].geometry.coordinates // [lng, lat]
            };
        }
    } catch (err) {
        console.error('Geocoding failed:', err.message);
        listing.geometry = { type: 'Point', coordinates: [0, 0] };
    }
    await listing.save();
    };

    req.flash('success', 'Listing updated successfully!'); // flash message
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!'); // flash message
    res.redirect("/listings");
};