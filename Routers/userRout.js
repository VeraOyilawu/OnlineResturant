const express = require("express")

const {SignIn, verification, resentVerification, forgetPassword, resetPassword, changePassword, login, signOut, allUsers, oneUser, deleteUser, updateUser} = require("../controllers/userController")

const {validateUser, validateEmail, validatePassword, validateChangePassword, validateUpdate, validatelogIn} = require("../middleware/userValidation")

const {userAuth} = require("../middleware/authentication")

const route = express.Router()                                                                          

route.post("/signIn", validateUser,  SignIn)
route.post("/verification/:token", verification )
route.post("/resendverification", validateEmail, resentVerification )
route.post("/forgetPassword",validateEmail, forgetPassword)
route.put("/resetPassword/:token", validatePassword, resetPassword);
route.put("/changePassword/:token", userAuth, validateChangePassword, changePassword);
route.post("/login", validatelogIn, login)
route.post("/signOut/:id", userAuth, signOut)
route.get("/allUser", allUsers)
route.get("/oneUser/:id", userAuth, oneUser)
route.patch("/updateUser/:id", userAuth, validateUpdate, updateUser)
route.delete("/deleteUser/:id", userAuth, deleteUser)

module.exports = route