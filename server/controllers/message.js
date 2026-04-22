const { imagekit } = require("../methods/ImageKit")
const { openai} = require("../methods/openAi")
const { Chat } = require("../models/chat.model")
const axios = require("axios")
const { main } = require("../models/user.model")
require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const textMessage = async(req,res)=> {
    const {userId,prompt,chatId} = req.body
    if(!userId || !prompt || !chatId ) {
        return res.json({
            success:false,
            message:"missing details"
        })
    }
    try {
        await main()
        const chat = await Chat.findById(chatId)
        if(!chat) {
            return res.json({
                success:false,
                message:"chat is not exists"
            })
        }
        chat.messages.push({
            isImage:false,
            content:prompt,
            role:"user"
        })
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if(!text) {
            return res.json({
                success:false,
                message:"there is no response from ai model"
            })
        }
        chat.messages.push({
            isImage:false,
            content:text,
            role:"assistant"
        })
        await chat.save();
        res.json({
            success:true,
            reply:{
            isImage:false,
            content:text,
            role:"assistant"
        }
        })
    } catch (error) {
        console.log(error)
    }
}
const imageMessage = async(req,res)=> {
    const {chatId,prompt,isPublished} = req.body;
    try {
        await main()
        const chat = await Chat.findById(chatId)
        chat.messages.push({
            isImage:false,
            content:prompt,
            role:"user"
        })
/*
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        })*/




        const result = await imagekit.upload({
            file:response.data[0].url, // يمكن أيضًا استخدام رابط أو base64
            fileName: `${Date.now()}.png`,
            tags: ["tag1", "tag2"],
            isPrivateFile: false,
            folder:"monabil"
        })
        const reply = {
            isImage:true,
            content:result.url,
            role:"assistant",
            isPublished
        }
        chat.messages.push(reply)
        await chat.save();
        res.json({
            success:true,
            reply
        })

    } catch (error) {
        console.log(error)
    }
}
const getMessages = async(req,res) => {
    const {chatId,userId} = req.body
    try {
        await main()
        const messages = await Chat.find({
            _id:chatId,
            userId
        }).select("messages")
        res.json({
            success:true,
            messages
        })
    } catch (error) {
        console.log(error)
    }
}
const getImages = async(req,res)=> {
    const {chatId,userId} = req.body
    try {
        const chat = await Chat.find({
            userId,
            _id:chatId
        })
        const images = chat.messages.filter((message)=> {
            if((message.isImage)&&(message.isPublished)) {
                return true
            }
            return false
        })
        res.json({
            success:true,
            images
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    textMessage,getMessages,getImages
}



        /*
        const encodedPrompt = encodeURIComponent(prompt.trim())
        const generatedImageUrl = `${process.env.URL_endpoint}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`
        console.log(generatedImageUrl)
        const aiImageResponse = await axios.get(generatedImageUrl,{
            responseType:"arraybuffer"
        })
        const base64 = `data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString('base64')}`*/