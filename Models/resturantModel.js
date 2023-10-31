const mongoose = require("mongoose")

const resturantSchema = new mongoose.Schema({
    resturantName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        // uniquwe: true
    },

    address:{
        type: String,
        required: true
    },

    image: {
        type: String,
    },

    menue: [{
        type: mongoose.Schema.Types.ObjectId,
       ref: "menueDetails"
    }],

    password: {
        type: String,
        required: true
    },

    comfirmPassword: {
        type: String,
        required: true
    },

    isAdmin: {
        type: String,
        default: false
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

const userModel = mongoose.model("resturant", resturantSchema)

module.exports = userModel

