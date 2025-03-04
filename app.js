// import express from "express";
// import mongoose from "mongoose";
// import Listing from "./models/listing.js";
// import { fileURLToPath } from "url";
// import path from "path";
// import methodoverride from "method-override";
// import ejsMate from "ejs-mate";
// import wrapasync from "./utils/wrapasync.js";
// import expreserror from "./utils/expreserror.js";
// import { listingSchema,reviewSchema} from "./schema.js";
// import Review from "./models/review.js";
// import listings from "./routes/listing.js";
// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"));
// const app=express();
// app.use(methodoverride("_method"));
// app.engine("ejs",ejsMate);
// const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.urlencoded({extended:true}));
// app.use(express.static(path.join(__dirname,"/public")));

// main().then(()=>{
// console.log("connected to database");
// }).catch((err)=>{console.log(err);});

// async function main(){
//     await mongoose.connect(MONGO_URL);
// }

// // app.set("view engine","ejs");
// // app.set("views",path.join(__dirname,"views"));

// app.get("/",(req,res)=>{
//     res.send("abcd");
// });
// // const validateListing=(req,res,next)=>{let {error}=listingSchema.validate(req.body);if(error){let errormessage=error.details.map(el=>el.message).join(",");throw new expreserror(400,errormessage);}else{next();}}
// // app.get("/listings/new",(req,res)=>{
// //     res.render("listing/new.ejs");
// // });
// const validateListing = (req, res, next) => {
//     console.log("Incoming request body:", req.body); // Debugging

//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         const errormessage = error.details.map(el => el.message).join(", ");
//         throw new expreserror(400, errormessage);
//     } else {
//         next();
//     }
// };
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const errormessage = error.details.map(el => el.message).join(", ");
//         throw new expreserror(400, errormessage);
//     } else {
//         next();
//     }
// };
// app.use("/listings",listings);
// // app.get("/listings/new",(req,res)=>{
// //     res.render("listing/new.ejs");
// // });
// // app.post("/listings",validateListing,wrapasync(async(req,res,next)=>{
// // const newlisting=new Listing(req.body.listing);
// //     await newlisting.save();res.redirect("/listings");
// //     console.log(newlisting)
// // }));
// // app.get("/listings/:id",wrapasync(async(req,res)=>{
// // let {id}=req.params;
// // console.log("id===========",req.params);
// // const listing=await Listing.findById(id).populate("reviews");
// // console.log(listing);
// // res.render("listing/show.ejs",{listing});
// // }));
// // app.get("/listings/:id", wrapasync(async (req, res) => {
// //     let { id } = req.params;
// //     console.log("id===========",req.params);

// //     const listing = await Listing.findById(id).populate("reviews").exec();
// //     res.render("listing/show.ejs", { listing });
// // }));

// // app.get("/listings",wrapasync(async (req,res)=>{
// // const allListing=await Listing.find({});
// // console.log(allListing);
// // res.render("listing/index.ejs",{allListing});
// // }));
// // app.get("/listings/:id/edit",wrapasync(async(req,res)=>{
// //     const {id}=req.params;
// //     const listing=await Listing.findById(id);
// //     res.render("listing/edit.ejs",{listing});}));

// // app.put("/listings/:id",validateListing,wrapasync(async(req,res)=>{
// // if(!req.body.listing){throw new expreserror(400,"invalid data");}
// // let {id}=req.params;
// // await Listing.findByIdAndUpdate(id,{...req.body.listing});
// // res.redirect(`/listings/${id}`);
// // }));
// app.post("/listings/:id/reviews",validateReview,wrapasync(async(req,res)=>{
//     let {id}=req.params;
//     let listing=await Listing.findById(id);
// let reviews=new Review(req.body.review);
// listing.reviews.push(reviews);
// await reviews.save();
// await listing.save();
// res.redirect(`/listings/${id}`);
// }));
// app.delete("/listings/:id/reviews/:reviewid",wrapasync(async(req,res)=>{
//     let {id,reviewid}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
//     await Review.findByIdAndDelete(reviewid);
//     res.redirect(`/listings/${id}`);
// }));
// // app.delete("/listings/:id",async(req,res)=>{
// // let {id}=req.params;
// // let deletedlisting=await Listing.findByIdAndDelete(id);
// // console.log(deletedlisting);
// // res.redirect("/listings");
// // });
// app.all("*",(req,res,next)=>{
//     next(new expreserror(404,"not found"));
// });
// app.use((err,req,res,next)=>{
//     console.log(err);
//     let {statusCode=500,message}=err;
//     console.log("a");
//     res.render("listing/error.ejs",{err});
// });



// app.listen(3000,()=>{console.log("listing on port 3000");});
import express from "express";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import { fileURLToPath } from "url";
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import wrapasync from "./utils/wrapasync.js";
import expresserror from "./utils/expreserror.js";
import { listingSchema, reviewSchema } from "./schema.js";
import Review from "./models/review.js";
import listings from "./routes/listing.js";
import reviews from "./routes/reviewS.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import localStrategy from "passport-local";
import User from "./models/user.js";
import user from "./routes/user.js";
import { configDotenv } from "dotenv";
if(process.env.NODE_ENV !== "production"){
const env = configDotenv();
console.log(env.parsed.A);
}
import {storage} from "./cloudconfig.js";
import multer from "multer";
const upload = multer({ storage });

// Initialize Express App
const app = express();

// Set View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));

// Connect to MongoDB
// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl=process.env.ATLASDB_URL;
main()
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("DB Connection Error:", err));

async function main() {
    await mongoose.connect(dbUrl);
}

// Middleware for Validation
const store=MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter:24*3600,
    crypto:{secret:process.env.SECRET},

});

store.on("error",function(err){
    console.log(err);
});
const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentuser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})
app.get("/demouser",async(req,res)=>{
    let fakeuser=new User({username:"demouser",password:"password",email:"Og9kO@example.com"});
    let newuser=await User.register(fakeuser,"password");
    res.send(newuser);
})
// Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);
// Root Route

// Create a New Review
// app.post("/listings/:id/reviews", validateReview, wrapasync(async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     let review = new Review(req.body.review);
//     await review.save(); 
//     listing.reviews.push(review);
//     await listing.save();
//     res.redirect(`/listings/${id}`);
// }));

// Delete a Review
// app.delete("/listings/:id/reviews/:reviewid", wrapasync(async (req, res) => {
//     let { id, reviewid } = req.params;
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
//     await Review.findByIdAndDelete(reviewid);
//     res.redirect(`/listings/${id}`);
// }));


app.all("*", (req, res, next) => {
    next(new expresserror(404, "Not Found"));
});


app.use((err, req, res, next) => {
    console.error(err);
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("listing/error.ejs", { err });
});

app.listen(3000, () => console.log("Server running on port 3000"));
