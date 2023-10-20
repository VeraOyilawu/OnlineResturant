// const { timeStamp } = require("console")
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        // uniquwe: true
    },

    password: {
        type: String,
        required: true
    },

    comfirmPassword: {
        type: String,
        required: true
    },
    isVerified: {
        type: String,
        default: false
    },
    isLogin: {
        type: String,
        default: false
    },
    Otp: {
        type: String,
        require: true
    }
},  {timeStamp: true}
)

const userModel = mongoose.model("users", UserSchema)

module.exports = userModel

