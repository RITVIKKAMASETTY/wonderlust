import mongoose, { Schema } from "mongoose";
const schema=mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
});
userSchema.plugin(passportLocalMongoose);
export default mongoose.model("User",userSchema);