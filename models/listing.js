import mongoose from "mongoose";
const schema = mongoose.Schema;
import Review from "./review.js";
const listingSchema = new schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    location: { type: String, required: true },
    image: {
        url: String,
        filename: {
            type: String,
        }
    },
    country: { type: String, required: true },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
});
listingSchema.post("findOneAndDelete", async(listing)=> {
if(listing){await Review.deleteMany({ _id: { $in: listing.reviews } });}
})
const Listing = mongoose.model("Listing", listingSchema);

export default Listing;