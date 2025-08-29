if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');  
const path = require('path');//require path for ejs
const methodOverride = require('method-override'); // For PUT and DELETE methods
const ejsMate = require('ejs-mate'); // EJS templating engine
const ExpressError = require('./utils/ExpressError.js'); // Custom error class for handling errors
const session = require('express-session'); // For session management
const flash = require('connect-flash'); // For flash messages
const passport = require('passport'); // For authentication
const LocalStrategy = require('passport-local'); // Local authentication strategy
const user = require("./models/user.js");

const listingRouter = require('./routes/listing.js'); // Importing the listings routes
const reviewRouter = require('./routes/review.js'); // Importing the reviews routes
const userRouter = require('./routes/user.js') // Importing the users routes
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
// SESSION CONFIGURATION
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 24 * 60 * 60 * 1000 * 3,
        maxAge: 24 * 60 * 60 * 1000 * 3, // 72 hours
        httpOnly: true
    },
};

//______________________________________________________
app.get("/", (req, res) => {
    res.send("Welcome to Wanderlust!");

});



app.use(session(sessionOptions)); // Use session middleware
app.use(flash()); // Use flash middleware

// PASSPORT CONFIGURATION___________________________________________________
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Use passport session
passport.use(new LocalStrategy(user.authenticate())); // Use local strategy for authentication
passport.serializeUser(user.serializeUser()); // Serialize user
passport.deserializeUser(user.deserializeUser()); // Deserialize user

//_________________________________________________________________________
// FLASH MESSAGES / define locals
app.use((req, res, next) => {
    res.locals.success = req.flash('success'); // Flash success messages
    res.locals.error = req.flash('error'); // Flash error messages
    res.locals.currentUser = req.user; // Make the current user available in all templates
    next();
});
//___________________________________________________________________
app.use('/listings', listingRouter); // Use the listings routes

app.use('/listings/:id/reviews', reviewRouter); // Use the reviews routes
app.use('/', userRouter); // Use the users routes

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




