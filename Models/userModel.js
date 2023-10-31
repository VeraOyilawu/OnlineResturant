const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },


    lastName: {
        type: String,
        required: true
    },


    email: {
        type: String,
        required: true,
    },

    phoneNumber: {
        type: String,
        required: true,
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
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;

