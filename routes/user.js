const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js"); 
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


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
        //login the user after sign up
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash('error', 'Login failed!');
                return next(err);
            }
            req.flash('success', 'Successfully registered!');
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect("/signup") ;
    }
});

//login 
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{ //passport provide authenticate
        failureRedirect: "/login",
        failureFlash: true
    }), async(req, res)=> { 
        req.flash('success', 'Welcome back!');
        res.redirect(res.locals.redirectUrl || "/listings");
    });


 //logout
    router.get("/logout", (req, res) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'you are logged out!');
            res.redirect("/listings");
        });
    });

module.exports = router;