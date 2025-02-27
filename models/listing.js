import mongoose from "mongoose";
const schema = mongoose.Schema;

const listingSchema = new schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    location: { type: String, required: true },
    image: {
        type: String,
        default: "https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlfGVufDB8fDB8fHww",
        set: (v) => {
            // If it's an object, extract the URL and return it as a string
            if (typeof v === 'object' && v !== null) {
                return v.url || '';  // Just extract the URL from the object
            }
            // If it's an empty string, return the default URL
            return v === "" ? "https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlfGVufDB8fDB8fHww" : v;
        }
    },
    country: { type: String, required: true },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;