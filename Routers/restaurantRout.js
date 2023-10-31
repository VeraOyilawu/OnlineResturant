const express = require("express")

const {signUpRestaurant, restaurantVerification, resentVerification, forgetPassword, resetPassword, changePassword, login, signOut, findAll} = require("../controllers/restaurantContoller")

const { validateEmail, validatePassword, validateChangePassword, validatelogIn} = require("../middleware/userValidation")


const router = express.Router()

router.post("/signupResturant", signUpRestaurant)
router.post("/restaurantVerification/:token", restaurantVerification)
router.post("/resentVerification/", resentVerification)
router.post("/forgetPassword",validateEmail, forgetPassword)
router.put("/resetPassword/:token", validatePassword, resetPassword);
router.put("/changePassword/:token", validateChangePassword, changePassword);
router.post("/login", validatelogIn, login)
router.post("/signOut/:id", signOut)
router.get("/allRestaurant", findAll)


module.exports = router