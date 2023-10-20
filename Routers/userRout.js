const express = require("express")
const {SignIn, verification, resentVerification, forgetPassword, resetPassword, changePassword, login, signOut, allUsers, oneUser, deleteUser, updateUser} = require("../controllers/userController")

const {validateUser, validateEmail, validatePassword, validateUpdate, validatelogIn} = require("../middleware/userValidation")

const route = express.Router()

route.post("/signIn", validateUser,  SignIn)
route.post("/verification/:token", validateEmail, verification )
route.post("/resendverification", validateEmail, resentVerification )
route.post("/forgetPassword",validateEmail, forgetPassword)
route.put("/resetPassword/:id", validatePassword, resetPassword);
route.put("/changePassword/:id", validatePassword, changePassword);
route.post("/login", validatelogIn, login)
route.post("/signOut/:id", signOut)
route.get("/allUser", allUsers)
route.get("/oneUser/:id", oneUser)
route.patch("/updateUser", validateUpdate, updateUser)
route.delete("/deleteUser/:id", deleteUser)

module.exports = route