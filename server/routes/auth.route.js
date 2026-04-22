const { login, register, protectAuth, isAuth, logout } = require("../controllers/auth");

const authRouter = require("express").Router();
authRouter.route("/register").post(register)
authRouter.route("/login").post(login)
authRouter.route("/isAuth").get(protectAuth,isAuth)
authRouter.route("/logout").get(protectAuth,logout)

module.exports = {
    authRouter
}