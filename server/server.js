const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const { authRouter } = require("./routes/auth.route");
const { main } = require("./models/user.model");
const { chatRouter } = require("./routes/chat.route");
const { messageRouter } = require("./routes/message.route");
const { planRouter } = require("./routes/plan.route");
const app = express();
require("dotenv").config();
app.use(require("cors")({
    origin:["http://localhost:3000"],
    credentials:true
}))


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.get("/",(req,res)=> {
    res.send("hello world from chatgpt")
})
app.use("/api/auth",authRouter)
app.use("/api/chat",chatRouter)
app.use("/api/message",messageRouter)
app.use("/api/purchase",planRouter)

app.listen(process.env.PORT||500,()=> {
    console.log(`welcome from port ${process.env.PORT}`)
})