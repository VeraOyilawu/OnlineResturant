const mongoose = require("mongoose")

const otpScheme = new mongoose.Schema({
    otp: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    //after 5 minutes this will bw deleted authomatically from the database
   createdAt:{type:Date, default:Date.now, index:{expires:"500s"}}
}, 
{timestamps: true})

const otpModel = mongoose.model("otp", otpScheme)

module.exports = otpModel