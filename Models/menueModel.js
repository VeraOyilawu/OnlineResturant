const { Mongoose } = require("mongoose")
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    resturant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "resturant"
    },
    foodName: {
        type: String,
        required: true
    },

    foodImage: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true
    },

},  {timeStamp: true}
)

const userModel = mongoose.model("users", UserSchema)

module.exports = userModel

