const mongoose = require("mongoose")

const url = "mongodb://localhost/foodDB"
const uri = "mongodb+srv://alexandraoyilawu:Zm26vMMSGZmkm4cx@cluster0.zxazxwb.mongodb.net/"

mongoose.connect(uri)
.then(() => {
    console.log("connected to database sucessfully");
})
.catch(() => {
    console.log("unable to connect to database");
})