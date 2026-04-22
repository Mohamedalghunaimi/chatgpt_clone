const { protectAuth } = require("../controllers/auth");
const { textMessage, imageMessage, getMessages, getImages } = require("../controllers/message");

const messageRouter = require("express").Router();
messageRouter.route("/send-text").post(protectAuth,textMessage)
//messageRouter.route("/send-image").post(protectAuth,imageMessage)
messageRouter.route("/all-messages").post(protectAuth,getMessages)
messageRouter.route("/all-images").post(protectAuth,getImages)

module.exports = {
    messageRouter
}