const { Chat } = require("../models/chat.model");
const { main } = require("../models/user.model");

const creatChat = async(req,res)=> {
    const {userId,userName}= req.body;
    try {
        await main()

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
    const {chatId} = req.body
    try {
        await main()
        const deletedChat = await Chat.findByIdAndDelete(chatId)
        if(!deletedChat) {
            return res.json({
                success:false,
                message:"chat is not exists"
            })
        }
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