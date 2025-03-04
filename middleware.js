import Listing from "./models/listing.js";
import { reviewSchema, listingSchema } from "./schema.js";
import Review from "./models/review.js";
import expresserror from "./utils/expreserror.js";
export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl; // Save the original URL for redirection after login
      req.flash('error', 'You must be logged in to access this page.');
      return res.redirect('/login');
    }
    next();
  };
  export const saveReturnTo = (req, res, next) => {
    if (req.session && req.session.returnTo) {
      res.locals.saveReturnTo = req.session.returnTo;
      delete req.session.returnTo; // Clear the session value after saving it to locals
    }
    next();
  };

  export const is=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentuser._id)){req.flash("error","you are not allowed to edit this listing");return res.redirect(`/listings/${id}`);}
    next();
  }

export const reviewis=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    req.session.reviewId =reviewid;
    let review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currentuser._id)){req.flash("error","you are not allowed to edit this review");return res.redirect(`/listings/${id}`);}
    next();
}