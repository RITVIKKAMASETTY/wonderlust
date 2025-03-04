import express from "express";
const router = express.Router();
import User from "../models/user.js";
import wrapasync from "../utils/wrapasync.js";
import passport from "passport";
import { isLoggedIn, saveReturnTo,is} from "../middleware.js";
import Listing from "../models/listing.js";


// Signup route
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapasync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);  // Forward the error to the error handler
      }
      req.flash("success", "Welcome to Wonderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}));

// Login route
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login", saveReturnTo, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}), async (req, res) => {
  req.flash("success", "Welcome! You are logged in.");
  const returnTo = res.locals.saveReturnTo || "/listings"; 
  res.redirect(returnTo);  
});


router.get("/logout", async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err); 
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
});

export default router;
