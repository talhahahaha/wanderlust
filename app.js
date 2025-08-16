const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');  
const path = require('path');//require path for ejs
const methodOverride = require('method-override'); // For PUT and DELETE methods
const ejsMate = require('ejs-mate'); // EJS templating engine
const wrapAsync = require('./utils/wrapAsync.js'); // Utility to wrap async functions for error handling
const ExpressError = require('./utils/ExpressError.js'); // Custom error class for handling errors
const { listingSchema } = require('./schema.js'); // Importing the Joi schema for validation
//______________________________________________________________________________________________________________________


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
//mongoose setting 
Main()
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.log(err);
});

async function Main() {
    await mongoose.connect(MONGO_URL);
}
//________________________________________________________________________________________
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the views directory
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(methodOverride('_method')); // Middleware for method override
app.engine('ejs', ejsMate); // Use ejsMate for EJS templating
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory
//____________________________________________________________________________________________________________
app.get("/", (req, res) => {
    res.send("Welcome to Wanderlust!");

});
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

// index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
        res.render("listings/index.ejs",{allListings});
    }));
    //____________________________________________________________
    // NEW LISTING ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});
//________________________________________________keep new route up____________

//SHOW ROUTE 
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/show.ejs", { listing });
}));
//___________________________________________________________________________________________


// CREATE LISTING ROUTE
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));
//___________________________________________________________________________________________
// EDIT LISTING ROUTE
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));
//___________________________________________________________________________________________
// update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); // ... is used to spread the properties of the listing object
    res.redirect(`/listings/${id}`);
}));
//___________________________________________________________________________________________

// delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//__________________________________________________
// ERROR HANDLING MIDDLEWARE

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = 'Something went wrong!'} = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});
//____________________________________________________
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//___________________________________________________________________________________________


