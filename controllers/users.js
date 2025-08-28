const User = require("../models/user.js");


module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
};



module.exports.signup = async (req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res)=> { 
        req.flash('success', 'Welcome back!');
        res.redirect(res.locals.redirectUrl || "/listings");
    };

module.exports.logout =  (req, res) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'you are logged out!');
            res.redirect("/listings");
        });
    };

