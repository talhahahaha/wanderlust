const express = require('express');
const app = express();
const mongoose = require('mongoose');  
const path = require('path');//require path for ejs
const methodOverride = require('method-override'); // For PUT and DELETE methods
const ejsMate = require('ejs-mate'); // EJS templating engine
const ExpressError = require('./utils/ExpressError.js'); // Custom error class for handling errors
const listings = require('./routes/listing.js'); // Importing the listings routes
const reviews = require('./routes/review.js'); // Importing the reviews routes
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


//___________________________________________________________________
app.use('/listings', listings); // Use the listings routes 

app.use('/listings/:id/reviews', reviews); // Use the reviews routes

//____________________________________________________________
// ERROR HANDLING MIDDLEWARE
// Order matters in Express!
// You must define all your routes before the error handler

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = 'Something went wrong!'} = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});
//____________________________________________________

//___________________________________________________________________________
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//___________________________________________________________________________________________




