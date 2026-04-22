const { imagekit } = require("../methods/ImageKit")
const { openai} = require("../methods/openAi")
const { Chat } = require("../models/chat.model")
const axios = require("axios")
const { main, User } = require("../models/user.model")
const {generateImage} = require("../methods/Sta_ai")
require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


const longText =    `🧠 نص طويل جدًا

في عالم التكنولوجيا الحديثة أصبح الذكاء الاصطناعي جزءًا أساسيًا من حياتنا اليومية، حيث نراه في كل مكان من الهواتف الذكية إلى السيارات ذاتية القيادة وحتى في الأنظمة الطبية المتقدمة التي تساعد الأطباء على تشخيص الأمراض بدقة عالية. ومع التطور السريع في مجال تعلم الآلة والشبكات العصبية العميقة، أصبحت الأنظمة قادرة على فهم اللغة البشرية والتفاعل معها بطريقة أقرب إلى الإنسان، مما فتح الباب أمام ثورة حقيقية في كيفية تفاعلنا مع البرمجيات.

إن بناء تطبيقات تعتمد على الذكاء الاصطناعي لم يعد أمرًا صعبًا كما كان في السابق، بل أصبح متاحًا للمطورين من خلال واجهات برمجية مثل Gemini و OpenAI و Hugging Face، حيث يمكن لأي مطور دمج قدرات قوية مثل تحليل النصوص، فهم الصور، توليد المحتوى، وحتى المحادثة الذكية داخل تطبيقاته بسهولة نسبية. وهذا أدى إلى انتشار واسع لتطبيقات الدردشة الذكية التي تحاكي نماذج مثل ChatGPT، والتي تعتمد على معالجة اللغة الطبيعية (NLP) لفهم سياق الحديث والرد بشكل منطقي وسلس.

ومن ناحية أخرى، فإن تطوير هذه الأنظمة لا يخلو من التحديات، حيث تحتاج إلى معالجة كميات ضخمة من البيانات، بالإضافة إلى تحسين الأداء وتقليل زمن الاستجابة، وضمان عدم وجود أخطاء في الفهم أو التوليد. كما أن هناك اعتبارات أخلاقية مهمة مثل حماية خصوصية المستخدمين، ومنع استخدام هذه التقنيات في أغراض ضارة أو مضللة.

ومع استمرار التطور، من المتوقع أن تصبح هذه النماذج أكثر ذكاءً وقدرة على اتخاذ قرارات معقدة، وربما تصل إلى مرحلة يمكنها فيها العمل كمساعدين شخصيين حقيقيين يديرون المهام اليومية بشكل مستقل، مثل جدولة المواعيد، كتابة التقارير، تحليل البيانات، وحتى التفاعل مع أنظمة الشركات بشكل مباشر.

وفي المستقبل القريب، قد نشهد اندماجًا أكبر بين الذكاء الاصطناعي والواقع المعزز والواقع الافتراضي، مما يخلق تجارب تفاعلية جديدة بالكامل، حيث يمكن للمستخدم التحدث مع أنظمة ذكية داخل بيئات ثلاثية الأبعاد وكأنها شخص حقيقي`


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
        const existingUser = await User.findById(userId).select("email");
        if(!existingUser) {
            return res.json({
                success:false,
                message:"user not found"
            })

        }
        if(existingUser.email !==req.email) {
            return res.json({
                success:false,
                message:"forbiddden"
            })
        }

        const chat = await Chat.findOne({_id:chatId,userId})
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
        return res.json({
            success:false,
            message:"something went wrong in server"
        })
    }
}
const imageMessage = async(req,res)=> {
    const {chatId,prompt,isPublished=true} = req.body;
    if(!chatId || !prompt) {
        return res.json({
            success:false,
            message:"missing details"
        })
    }
    try {



        await main()
        const existingUser = await User.find({email:req.email});
        if(!existingUser) {
            return res.json({
                success:false,
                message:"user not found"
            })

        }


        
        const chat = await Chat.findById(chatId);
        if(!chat) {
            return res.json({
                success:false,
                message:"chat not found"
            })
        }
        chat.messages.push({
            isImage:false,
            content:prompt,
            role:"user"
        })

        const result = await generateImage(prompt)
        if(result["finish_reason"] !=="SUCCESS") {
            return res.json({
                success:false,
                message:"something went wrong"
            })
        }

        
        const resultOfImage = await imagekit.upload({
            file: `data:image/png;base64,${result.image}`, // يمكن أيضًا استخدام رابط أو base64
            fileName: `${Date.now()}.png`,
            tags: ["tag1", "tag2"],
            isPrivateFile: false,
            folder:"monabil"
        })
        const reply = {
            isImage:true,
            content:resultOfImage.url,
            role:"assistant",
            isPublished
        }
        chat.messages.push(reply)
        await chat.save();
        if(existingUser.cradits < 2) {
            return res.json({
                success:false,
                message:"your are reached to the limit"
            })

        }
        await User.updateOne(
          { _id: existingUser._id },
          { $inc: { cradits: -2 } }
        );
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
    if(!chatId || !userId) {
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
        if(existingUser.email!==req.email) {
            return res.json({
                success:false,
                message:"forbidden"
            })

        }
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
    if(!chatId || !userId) {
        return res.json({
            success:false,
            message:"missing details"
        })
    }
    try {
        const existingUser = await User.findById(userId).select("email");
        if(!existingUser) {
            return res.json({
                success:false,
                message:"user not found"
            })
        }
        if(existingUser.email!==req.email) {
            return res.json({
                success:false,
                message:"forbidden"
            })

        }

        const chat = await Chat.find({
            userId,
            _id:chatId
        })
        if(!chat) {
            return res.json({
                success:false,
                message:"chat is not found"
            })
        }
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
    textMessage,getMessages,getImages,
    imageMessage
}



