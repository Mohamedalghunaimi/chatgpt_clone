const { protectAuth } = require("../controllers/auth");
const { getPlans, purhasePlan, successPay } = require("../controllers/Transaction");

const planRouter = require("express").Router();
planRouter.route("/plans").get(protectAuth,getPlans)
planRouter.route("/purchase-plan").post(protectAuth,purhasePlan)
planRouter.route("/success-pay").post(protectAuth,successPay)
module.exports = {
    planRouter
}