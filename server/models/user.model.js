const mongoose = require("mongoose");
require("dotenv").config()
const main = async()=> {
    await mongoose.connect(process.env.db_url)
}
const userSchema = new mongoose.Schema({
    email:{
        required:true,
        type:String,
        isEmail:true,
        unique:true,
    },
    name: {
        required:true,
        type:String,
    },
    password:{
        required:true,
        type:String,
    },
    cradits: {
        type:Number,
        default:6
    }

},{timestamps:true})

const User = mongoose.model("User",userSchema)
module.exports = {
    main,
    User
}