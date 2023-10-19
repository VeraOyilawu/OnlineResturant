const express = require("express")
const {SignIn, verification} = require("../controllers/userController")

const route = express.Router()

route.post("/signIn", SignIn)
route.get("/verification/:token", verification )

module.exports = route