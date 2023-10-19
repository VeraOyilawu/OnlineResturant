const userModel = require("../Models/userModel")
const emailSender = require("../utils/emailSender")
const otpModel = require("../Models/otpModel")
const bcrypt = require("bcrypt")
const otpGenerator = require("otp-generator")
const jwt = require("jsonwebtoken")
const sendMail = require("../utils/emailTem")
const dotenv = require('dotenv').config();


const SignIn = async(req, res) => {
   try {
    const {userName, email, password, comfirmPassword, otp} = req.body

    const Emailer = await userModel.findOne({email})
    if (Emailer) {
        return res.status(500).json({
            message: `${Emailer} is already registerd with this email`
        })
    } else {
        const OTP = otpGenerator.generate(5, {
            digits: true,
            lowerCaseAlphabets: false,
            alphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        }).replace(/\D/g, '');

        const userOtp = new otpModel({
            otp: OTP
        })
        const savedOtp = await userOtp.save();


        if (password !== comfirmPassword){
           return res.status(500).json({
                message: "Your password has to be the same with your confirmPassword"
            })
        } else {
            // const salt = await bcrypt.genSalt(10);
            // const hashPassword = await bcrypt.hash(password, salt);
            // // const salt = await bcrypt.genSalt(10)
            // // const hashPassword = bcrypt.hash(password, salt)

            const reqBody = await new userModel({
                userName, 
                email, 
                password,
                comfirmPassword,
                otp: savedOtp._id
            })

            const savedUser = await reqBody.save()

            const token = jwt.sign({ email: savedUser.email, userId: savedUser._id }, process.env.Secret, { expiresIn: "333mins" });

            const subject = ' Kindly Verify your  Registration'
            const html = await sendMail(OTP)
            emailSender({
                email: email,
                subject,
                html
            })


            // const subject = 'Email Verification'
            // const html = sendMail(OTP)
            // mailer({
            //     email: savedUser.email,
            //     subject,
            //     html
            // })
            
            res.status(200).json({
                message: `${savedUser.userName} is registered sucessfully`,
                data: token
            })

        }
    }
   } catch (error) {
    res.status(500).json({
        message: error.message
    })
   }
}


const verification = async(req, res) => {
    try {
       const { token } = req.params
       const { otp } = req.body
       
       if (!token) {
        return res.status(400).json({ 
            message: 'Token not found' 
        });
       } else {
        if (!otp) {
            return res.status(400).json({ 
                message: 'OTP has to be inputed'
             });
           }
       }

       const {email} = jwt.verify(token, process.env.Secret)
       const user = await userModel.findOne({email})

       if (!user) {
        return res.status(400).json({
            message: "Email not found"
        })
       }
       if (user.isVerified === true) {
        return res.status(400).json({
            message: "user has already been verifield"
        })
       }
       const savedOtp = await otpModel.findOne({ _id: user.Otp });

       if (!savedOtp) {
           return res.status(404).json({ message: 'OTP not found' });
       }
       await otpModel.deleteOne({ _id: savedOtp._id }); 

       res.status(200).json({
        message: `${user.userName} has been verified sucessfully `
       })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    SignIn,
    verification
}