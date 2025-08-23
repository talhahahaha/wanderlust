const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js"); 
const passport = require("passport");


// Sign up
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
}); 

router.post("/signup", async (req, res) => {
    try {
        let {username, email, password}= req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash('success', 'Successfully registered!');
    } catch (error) {
        req.flash('error', 'Registration failed!');
        console.log(error);
    }
    res.redirect("/listings");
});

//login 
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", 
    passport.authenticate("local",{ //passport provide authenticate
        failureRedirect: "/login",
        failureFlash: true
    }), async(req, res)=> { 
        req.flash('success', 'Welcome back!');
        res.redirect("/listings");
    });


module.exports = router;