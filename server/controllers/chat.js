const { Chat } = require("../models/chat.model");
const { main, User } = require("../models/user.model");

const creatChat = async(req,res)=> {
    const {userId,userName}= req.body;
    if(!userId || !userName) {
        return res.json({
            success:false,
            message:"missing details"
        })
    }
    try {
        await main()
        const existingUser = await User.findById(userId).select("email");
        if(!existingUser) {
            return res.json({
                success:false,
                message:"user not found"
            })
        }
        if(req.email!==existingUser.email) {
            return res.json({
                success:false,
                messages:"forbidden"
            })

        }

        const newChat = new Chat({
            userId,
            userName,
            messages:[],
            name:"new chat"
        })
        const savedChat = await newChat.save();
        res.json({
            success:true,
            chat:savedChat
        })

        } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:"something went wrong in the server"
        })
    }
}
const getChats = async(req,res)=> {
    const {userId} = req.body
    try {
        await main()
        const existingUser = await User.findById(userId).select("email");
        if(!existingUser) {
            return res.json({
                success:false,
                message:"user not found"
            })
        }
        if(req.email!==existingUser.email) {
            return res.json({
                success:false,
                messages:"forbidden"
            })

        }
        const chats = await Chat.find({userId}).sort({updatedAt:-1})
        res.json({
            success:true,
            chats
        })
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}
const deleteChat = async(req,res)=> {
    const {chatId} = req.body;
    if(!chatId) {
        return res.json({
            success:false,
            message:"missing details"
        })
    }

    try {
        await main()
        const existingUser = await User.findOne({email:req.email});
        if(!existingUser) {
            return res.json({
                success:false,
                message:"user not found"
            })
        }

        const existingChat = await Chat.findOne({
            _id:chatId,
            userId:existingUser._id

        })
        if(!existingChat) {
            return res.json({
                success:false,
                message:"chat not found"
            })
        }
        await Chat.deleteOne({_id:existingChat._id})

        res.json({
            success:true,
            message:"chat is deleted"
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {
    creatChat,getChats,deleteChat
}