const { main, User } = require("../models/user.model")
var jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
require("dotenv").config()
const register = async(req,res) => {
    const {email,password,name} = req.body;
    try {
        await main()
        const user = await User.findOne({email})
        if(user) {
            return res.json({
                success:false,
                message:"the user is already exists",
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password:hashedPassword
        })
        var token = await jwt.sign({ email }, process.env.token_secret);
        res.cookie("token",token)
        const savedUser = await newUser.save();
        res.json({
            success:true,
            message:"the operation is done",
            user:savedUser
        })
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}
const login = async(req,res) => {
    const {email,password} = req.body
    try {
        await main()

        const user = await User.findOne({email})
        if(!user) {
            return res.json({
                success:false,
                message:"you must sign up before"
            })
        }
        const check = await bcrypt.compare(password,user.password);
        if(!check) {
            return res.json({
                success:false,
                message:"password is wrong"
            })
        }
        var token =await  jwt.sign({ email }, process.env.token_secret);
        res.cookie("token",token)
        console.log(req.cookies)
        res.json({
            success:true,
            user
        })

        
    }
    catch(error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })

    }
}
const protectAuth = async(req,res,next) => {
    try {
        const {token} = req.cookies;
        const decoded = await jwt.verify(token,process.env.token_secret)
        if(!decoded) {
            return res.json({
                success:false,
                message:"you are not authorized"
            })
        }
        req.email = decoded.email;
        next();
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
        
    }
}

const isAuth = async(req,res)=> {
    try {
        if(req.email) {
            await main()
            const user = await User.findOne({email:req.email})
            return res.json({
                success:true,
                user
            })
        }else { throw new Error("you are not authorized")}
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
        
    }
}
const logout = async(req,res) => {
    res.clearCookie("token")
    res.json({
        success:true
    })
}

module.exports = {
    register,login,protectAuth,isAuth,logout
}