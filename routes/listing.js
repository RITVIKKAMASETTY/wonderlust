import express from "express";
import path from "path";
import wrapasync from "../utils/wrapasync.js";
import expresserror from "../utils/expreserror.js";
import { listingSchema } from "../schema.js";
import Listing from "../models/listing.js";
import { isLoggedIn, saveReturnTo, is } from "../middleware.js";
import dotenv from "dotenv";
import { storage } from "../cloudconfig.js";
import multer from "multer";

// Create router
const router = express.Router();

// Set up multer with Cloudinary storage
const upload = multer({ storage });

// Validation middleware
const validateListing = (req, res, next) => {
  console.log("Incoming request body:", req.body);
  
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errormessage = error.details.map(el => el.message).join(", ");
    throw new expresserror(400, errormessage);
  } else {
    next();
  }
};

// GET - New listing form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listing/new.ejs");
});

// POST - Create new listing
router.post("/", isLoggedIn, upload.single("listing[image]"), wrapasync(async (req, res, next) => {
  if (!req.file) {
    req.flash("error", "Please upload an image");
    return res.redirect("/listings/new");
  }
  
  console.log("File uploaded successfully!");
  console.log("URL =", req.file.path);
  console.log("Filename =", req.file.filename);
  
  // Create new listing object
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { 
    url: req.file.path, 
    filename: req.file.filename 
  };
  
  // Save to database
  await newlisting.save();
  req.flash("success", "Created a new listing");
  res.redirect("/listings");
}));

// GET - Show specific listing
router.get("/:id", wrapasync(async (req, res) => {
  let { id } = req.params;
  
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: "author" })
    .populate("owner")
    .exec();
    
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  
  res.render("listing/show.ejs", { listing });
}));

// GET - List all listings
router.get("/", wrapasync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });
}));

// GET - Edit listing form
router.get("/:id/edit", isLoggedIn, is, wrapasync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  let oi=listing.image.url;
  oi.replace("/upload/","/upload/w_250/");
  res.render("listing/edit.ejs", { listing,oi});
}));

// PUT - Update listing
router.put("/:id", isLoggedIn, is, upload.single("listing[image]"), wrapasync(async (req, res) => {
  if (!req.body.listing) {
    throw new expresserror(400, "Invalid data");
  }

  let { id } = req.params;
  const updatedData = { ...req.body.listing };
  
 
  if (req.file) {
    updatedData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    

  }

  await Listing.findByIdAndUpdate(id, updatedData);
  req.flash("success", "Updated listing");
  res.redirect(`/listings/${id}`);
}));

// DELETE - Remove listing
router.delete("/:id", isLoggedIn,is, wrapasync(async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted listing");
  res.redirect("/listings");
}));

export default router;