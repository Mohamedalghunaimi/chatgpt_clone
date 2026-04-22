const { protectAuth } = require("../controllers/auth");
const { creatChat, getChats, deleteChat } = require("../controllers/chat");

const chatRouter = require("express").Router();
chatRouter.route("/create").post(protectAuth,creatChat)
chatRouter.route("/chats").post(protectAuth,getChats)
chatRouter.route("/delete").post(protectAuth,deleteChat)

module.exports = {
    chatRouter
}