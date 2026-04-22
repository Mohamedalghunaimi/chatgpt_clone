const { Transaction } = require("../models/transaction.model");
const { main, User } = require("../models/user.model");
require("dotenv").config();
const stripe = require("stripe")(process.env.stripe_secret)
const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
];

const getPlans = async(req,res) => {
    try {
        res.json({
            success:true,
            plans
        })
    } catch (error) {
        console.log(error)
    }
}
const purhasePlan = async(req,res)=> {
    const {userId,planId} = req.body
    const {origin} = req.headers
    try {
        await main()
        const plan = plans.find((plan)=>plan._id===planId)
        if(!plan) {
            return res.json({
                success:false,
                messsage:"plan is not exists"
            })
        }
        const newTransaction = new Transaction({
            planId,
            userId,
            amount:plan.price,
            credits:plan.credits
        })
        //const updatedUser = await User.findByIdAndUpdate(userId,{credits:plan.credits})
        const savedTransaction= await newTransaction.save();
        const session = await stripe.checkout.sessions.create({
            line_items:[
                {
                    price_data:{
                        currency:"usd",
                        unit_amount:plan.price*100,
                        product_data:{
                            name:plan.name
                        }
                    },
                    quantity:1
                }
            ],
            mode:"payment",
            success_url:`${origin}/loading?id=${savedTransaction._id}`,
            cancel_url:`${origin}/failed`
        })
        res.json({
            success:true,
            url:session.url
        })
    } catch (error) {
        console.log(error)
    }
}

const successPay = async(req,res)=> {
    const {userId,transactionId} = req.body
    try {
        await main();
        const transaction = await Transaction.findOne({_id:transactionId,userId})
        if(!transaction) {
            return res.json({
                sucess:false,
                messsage:"wrong details!"
            })
        }
        if(transaction.isPaid) {
            return res.json({
                success:false,
                message:"transaction is already paied"
            })
        }
        transaction.isPaid = true,
        await User.findByIdAndUpdate(userId,{credits:transaction.credits})
        await transaction.save();
        res.json({
            success:true,
            message:"transaction is paied"
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    getPlans,purhasePlan,successPay
}