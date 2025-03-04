import express from "express";
import mongoose from "mongoose";
const router = express.Router({ mergeParams: true });
import wrapasync from "../utils/wrapasync.js";
import Review from "../models/review.js";
import Listing from "../models/listing.js";
import expresserror from "../utils/expreserror.js";
import { reviewSchema } from "../schema.js";
import {isLoggedIn,saveReturnTo, is,reviewis} from "../middleware.js";

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errormessage = error.details.map((el) => el.message).join(", ");
        throw new expresserror(400, errormessage);
    } else {
        next();
    }
};


router.post("/",isLoggedIn, validateReview, wrapasync(async (req, res, next) => {
    let { id } = req.params;
    console.log("Received POST request for Listing ID:", id);  

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new expresserror(400, "Invalid Listing ID"));
    }

    let listing = await Listing.findById(id);
    if (!listing) {  
        return next(new expresserror(404, "Listing not found"));  
    }

    let review = new Review(req.body.review);
    review.author=req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "review added");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:reviewid",reviewis,isLoggedIn, wrapasync(async (req, res, next) => {
    let { id, reviewid } = req.params;
    console.log(`Deleting review ${reviewid} from listing ${id}`); 

   
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewid)) {
        return next(new expresserror(400, "Invalid ID for Listing or Review"));
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "review deleted");
    res.redirect(`/listings/${id}`);
}));

export default router;
