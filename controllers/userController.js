const userModel = require("../Models/userModel");
const emailSender = require("../utils/emailSender")
const bcrypt = require("bcrypt")
const otpGenerator = require("otp-generator")
const jwt = require("jsonwebtoken")
const sendMail = require("../utils/emailTem")
const forgerMail = require("../utils/forgetTem")
const dotenv = require('dotenv').config();



const SignIn = async(req, res) => {
   try {
    const {firstName, lastName, email, phoneNumber, password, comfirmPassword, otp} = req.body

    const Emailer = await userModel.findOne({email}).maxTimeMS(20000)
    if (Emailer) {
        return res.status(500).json({
            message: `${Emailer} has already registerd.`
        })
    } else {
        const OTP = otpGenerator.generate(5, {
            digits: true,
            lowerCaseAlphabets: false,
            alphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        }).replace(/\D/g, '');
        


        if (password !== comfirmPassword){
           return res.status(500).json({
                message: "Your password has to be the same with your confirmPassword"
            })
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
           

            const reqBody = await new userModel({
                firstName,
                lastName, 
                email, 
                phoneNumber,
                password: hashPassword,
                comfirmPassword: hashPassword,
                Otp: OTP
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

            res.status(200).json({
                message: `${savedUser.userName} is registered sucessfully`,
                dat: savedUser,
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

       const {email} = jwt.verify( token, process.env.Secret )

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

       
       if (!user.Otp) {
        return res.status(404).json({ message: 'OTP not found' });
    }

       if (!user.Otp === otp) {
        return res.status(400).json({
            message: "You have to input the correct OTP"
        })
       } else {
        user.isVerified = true;
        await user.save();

        await userModel.updateOne({ email: user.email }, { Otp: null }, {new : true});

        res.status(200).json({
            message: `${user.userName} has been verified sucessfully `
           })
    }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const resentVerification = async(req,res) => {
    try {
        const {email} = req.body

        const user = await userModel.findOne({email})

        if (!user) {
            return res.status(500).json({
                message: "email not found"
            })
        }
        if (user.isVerified === true) {
            return res.status(500).json({
            message: "user has already been verified"
            })
        }

        const otp = user.Otp
        

        const OTP = otpGenerator.generate(5, {
            digits: true,
            lowerCaseAlphabets: false,
            alphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        }).replace(/\D/g, '');

        user.Otp = OTP
        
           const token = jwt.sign({ email: user.email, userId: user._id }, process.env.Secret, { expiresIn: "333mins" });

            const subject = ' Resend Verification'
            const html = sendMail(OTP)
            emailSender({
                email: email,
                subject,
                html
            })

            user.save()

            res.status(200).json({
                message: `${user.email} the OTP ha been sent to you`,
                data: user,
                token: token
            })
   
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const login = async(req, res) => {
    try {
        const {email, password} = req.body

        
        if (!email && password) {
            return res.status(404).json({
                message: "No fileld is allowed to be empty"
            })
        }

        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }

        const checkedPassword = bcrypt.compare(password, user.password)

        if (!checkedPassword) {
            return res.status(404).json({
                message: "invalid password"
            })
        }

        if (!user.isVerified == true) {
            return res.status(500).json({
                message: "user is not verified"
            })
        }

        const islogin = await userModel.findByIdAndUpdate(user._id, {isLogin: true}, {new: true});

        const token = jwt.sign({email: user.email, id: user._id,}, process.env.Secret, {expiresIn: "300mins"})
        islogin.save()

        res.status(200).json({
            message: 'Login sucessfully',
            data: user,
            token: token
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const signOut = async(req, res) => {
    try {
        const id = req.params.id;

        const userId = await userModel.findById(id)

        const logout = await userModel.findByIdAndUpdate(userId, {isLogin: false}, {new: true}); 
        logout.save()

        if (!userId.isLogin === true) {
            return res.status(200).json({
                message: 'Logged not successfully'
            })
        }
        
        res.status(200).json({
            message: 'Logged out successfully',
            data: logout
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const forgetPassword = async(req, res) => {
    try {
        const { email } = req.body

        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(500).json({
                message: "user not found"
            })
        }

        const token = jwt.sign({userId: user._id, user: user.email}, process.env.Secret, {expiresIn: "333mins"})

        const subject = 'Link for Reset password'
      
        const link = `https://localhost:1987/api/resetPassword/${token}`
        const html = await forgerMail(link)
        emailSender({
            email: email,
            subject,
            html
        });
        res.status(200).json({
            message: 'Email sent successfully, check your Email to reset your Password'
        })

    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
}

const resetPassword = async(req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
        return res.status(404).json({
            error: "Please enter a new password"
        });
        }

        const decodedToken = jwt.verify(token, process.env.Secret);
    
        const userId = decodedToken.userId;
    
        const user = await userModel.findById(userId);
        if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        user.password = hashedPassword;
        await user.save();
    
        res.status(200).json({
        message: "Password reset successful"
        });
      
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const changePassword = async(req, res) => {
    try {
        const { password, oldPassword } = req.body;
        const { token } = req.params;

        if (!password || !oldPassword) {
            return res.status(404).json({
              message: "password must be entered"
            });
          }

        const decodedToken = jwt.verify(token, process.env.Secret);
        const userId = decodedToken.id;

        const user = await userModel.findById(userId);
        console.log(user);
        if (!user) {
            return res.status(404).json({
                message: "user not found ooooo"
              });
        }
        const matchPassword = await bcrypt.compare(oldPassword, user.password);
    
        if (!matchPassword) {
            return res.status(401).json({
              message: "password is incorrect."
            });
          }
    
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newPassword = await userModel.findByIdAndUpdate(userId, {password: hashedPassword}, {new: true});
        if (!newPassword) {
            res.status(400).json({
                message: 'Failed to Change Password'
            })
        } else {
            res.status(200).json({
                message: 'Password Change sucessfully',
                data: newPassword
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })  
    }
}


const allUsers = async(req, res) => {
    try {
        const users = await userModel.find().maxTimeMS(20000); // 20 seconds timeout

        if (users === 0) {
            return res.status(500).json({
                message: "There is no user found"
            }) 
        }

         res.status(500).json({
            message: "users available are" + users.length,
            data: users
        }) 
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })  
    }
}

const oneUser = async(req, res) => {
    try {
        const userId = req.params.id;

        const user = await userModel.findById(userId)
        if (user === 0) {
            res.status(404).json({
                message: 'No user found'
            })
        } else {
            res.status(200).json({
                message: 'The user Record',
                data: user
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })  
    }
}

const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(200).json({
          message: `${user.userName} not found`,
        })
      }
      const deletedUser = await userModel.findByIdAndDelete(userId)
      res.status(200).json({
        message: 'User deleted successfully',
        data: deletedUser
      })
  
    } catch (error) {
      res.status(500).json({
        Error: error.message
      })
    }
  }

  const updateUser = async (req, res)=>{
    try {
        const {firstName, lastName, email, phoneNumber} = req.body;
        
        const { id } = req.params;
        const user = await userModel.findById(id);

        if(!user) {
            res.status(404).json({
                message: 'User not Found'
            })
        } else {
            const data = {
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                email: email || user.email,
                phoneNumber: phoneNumber || user.phoneNumber,
            }
            const updatedUser = await userModel.findByIdAndUpdate(user, data, {new: true});
            if (!updatedUser) {
                res.status(400).json({
                    message: 'Could not update School Info'
                })
            } else {
                res.status(200).json({
                    message: 'Successfully Updated School Info',
                    data: updatedUser
                })
            }
        }
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};
  

module.exports = {
    SignIn,
    verification,
    resentVerification,
    login,
    signOut,
    forgetPassword,
    resetPassword,
    changePassword,
    allUsers,
    oneUser,
    deleteUser,
    updateUser
}