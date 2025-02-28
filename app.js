import express from "express";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import { fileURLToPath } from "url";
import path from "path";
import methodoverride from "method-override";
import ejsMate from "ejs-mate";
import wrapasync from "./utils/wrapasync.js";
import expreserror from "./utils/expreserror.js";
import { listingSchema,reviewSchema} from "./schema.js";
import Review from "./models/review.js";
const app=express();
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

main().then(()=>{
console.log("connected to database");
}).catch((err)=>{console.log(err);});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.get("/",(req,res)=>{
    res.send("abcd");
});
// const validateListing=(req,res,next)=>{let {error}=listingSchema.validate(req.body);if(error){let errormessage=error.details.map(el=>el.message).join(",");throw new expreserror(400,errormessage);}else{next();}}
// app.get("/listings/new",(req,res)=>{
//     res.render("listing/new.ejs");
// });
const validateListing = (req, res, next) => {
    console.log("Incoming request body:", req.body); // Debugging

    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errormessage = error.details.map(el => el.message).join(", ");
        throw new expreserror(400, errormessage);
    } else {
        next();
    }
};
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errormessage = error.details.map(el => el.message).join(", ");
        throw new expreserror(400, errormessage);
    } else {
        next();
    }
};

app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
});
app.post("/listings",validateListing,wrapasync(async(req,res,next)=>{
const newlisting=new Listing(req.body.listing);
    await newlisting.save();res.redirect("/listings");
    console.log(newlisting)
}));
// app.get("/listings/:id",wrapasync(async(req,res)=>{
// let {id}=req.params;
// console.log("id===========",req.params);
// const listing=await Listing.findById(id).populate("reviews");
// console.log(listing);
// res.render("listing/show.ejs",{listing});
// }));
app.get("/listings/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    console.log("id===========",req.params);

    const listing = await Listing.findById(id).populate("reviews").exec();
    res.render("listing/show.ejs", { listing });
}));

app.get("/listings",wrapasync(async (req,res)=>{
const allListing=await Listing.find({});
console.log(allListing);
res.render("listing/index.ejs",{allListing});
}));
app.get("/listings/:id/edit",wrapasync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});}));

app.put("/listings/:id",validateListing,wrapasync(async(req,res)=>{
if(!req.body.listing){throw new expreserror(400,"invalid data");}
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);
}));
app.post("/listings/:id/reviews",validateReview,wrapasync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
let reviews=new Review(req.body.review);
listing.reviews.push(reviews);
await reviews.save();
await listing.save();
res.redirect(`/listings/${id}`);
}));
app.delete("/listings/:id/reviews/:reviewid",wrapasync(async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}));
app.delete("/listings/:id",async(req,res)=>{
let {id}=req.params;
let deletedlisting=await Listing.findByIdAndDelete(id);
console.log(deletedlisting);
res.redirect("/listings");
});
app.all("*",(req,res,next)=>{
    next(new expreserror(404,"not found"));
});
app.use((err,req,res,next)=>{
    console.log(err);
    let {statusCode=500,message}=err;
    console.log("a");
    res.render("listing/error.ejs",{err});
});



app.listen(3000,()=>{console.log("listing on port 3000");});