const mongoose = require("mongoose")

const url = "mongodb://localhost/foodDB"

mongoose.connect(url)
.then(() => {
    console.log("connected to database sucessfully");
})
.catch(() => {
    console.log("unable to connect to database");
})