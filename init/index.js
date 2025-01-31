import mongoose from "mongoose";
import data from "./data.js";
import Listing from "../models/listing.js";
const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";

main().then(()=>{
console.log("connected to database");
}).catch((err)=>{console.log(err);});

async function main(){
    await mongoose.connect(MONGO_URL);
}
const initDB=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("data was initilised");
}
initDB();