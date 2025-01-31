import express from "express";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import { fileURLToPath } from "url";
import path from "path";
import methodoverride from "method-override";
import ejsMate from "ejs-mate";
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
app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
});
app.post("/listings",async(req,res)=>{
const newlisting=new Listing(req.body.listing);
newlisting.save();res.redirect("/listings");
console.log(newlisting);});
app.get("/listings/:id",async(req,res)=>{
let {id}=req.params;
const listing=await Listing.findById(id);
res.render("listing/show.ejs",{listing});
});
app.get("/listings",async (req,res)=>{
const allListing=await Listing.find({});
res.render("listing/index.ejs",{allListing});
});

app.get("/listings/:id/edit",async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});});

app.put("/listings/:id",async(req,res)=>{
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id",async(req,res)=>{
let {id}=req.params;
let deletedlisting=await Listing.findByIdAndDelete(id);
console.log(deletedlisting);
res.redirect("/listings");
})





app.listen(3000,()=>{console.log("listing on port 3000");});