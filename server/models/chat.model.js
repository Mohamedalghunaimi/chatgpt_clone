const mongoose = require("mongoose")
const messageSchema = new mongoose.Schema({
    isImage:{
        type:Boolean,
        required:true
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    role :{
        type:String,
        required:true
    },
    content :{
        type:String,
        required:true
    }
},{timestamps:true})

const chatSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    name :{
        type:String,
        required:true
    },
    messages:[
        messageSchema
    ]

})

const Chat = mongoose.model("Chat",chatSchema)

module.exports = {
    Chat
}