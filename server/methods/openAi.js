const  OpenAI =  require("openai");
require("dotenv").config()

const openai = new OpenAI({
    apiKey: process.env.GOOGLE_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


module.exports = {
    openai
}