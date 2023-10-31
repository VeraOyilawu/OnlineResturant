const resturantModel = require("../Models/resturantModel")
const bcrypt = require("bcrypt")
const otpGenerator = require("otp-generator")
const emailSender = require("../utils/emailSender")
const jwt = require("jsonwebtoken")
const cloudinary = require("../utils/cloudinary")
const sendMail = require("../utils/emailTem")
const forgerMail = require("../utils/forgetTem")


const signUpRestaurant = async(req, res) => {
    try {
        const {resturantName, email, address, image, password, comfirmPassword } = req.body

        if (req.files) {
            const Emailer = await resturantModel.findOne({email}).maxTimeMS(20000)

            if (Emailer) {
                return res.status(500).json({
                    message: `${Emailer.email} has already been used.`
                })
            }  
            console.log(Emailer);
            console.log("oga");
    
            const image = req.files.image.tempFilePath
            const uploadImage = await cloudinary.uploader.upload(image);

            const OTP = otpGenerator.generate(5, {
                digits: true,
                lowerCaseAlphabets: false,
                alphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            }).replace(/\D/g, '');
            console.log("vero");
            
            if (password !== comfirmPassword){
               return res.status(500).json({
                    message: "Your password has to be the same with your confirmPassword"
                })
            } else {
                const salt = await bcrypt.genSalt(10);
              
                const reqBody = await new resturantModel({
                    resturantName: resturantName.toUpperCase(), 
                    email: email.toLowerCase(), 
                    address,
                    image: uploadImage,
                    password: hashPassword,
                    comfirmPassword: hashPassword,
                    Otp: OTP
                })
    
                const savedRestaurant = await reqBody.save()
    
                const token = jwt.sign({ email: savedRestaurant.email, id: savedRestaurant._id }, process.env.Secret, { expiresIn: "333mins" });
    
                const subject = ' Kindly Verify your  Registration'
                const html = await sendMail(OTP)
                emailSender({
                    email: email,
                    subject,
                    html
                })
    
                res.status(200).json({
                    message: `${savedRestaurant.resturantName} is registered sucessfully with image`,
                    dat: savedRestaurant,
                    data: token
                })
            }

        } else {
            const Emailer = await resturantModel.findOne({email}).maxTimeMS(20000)
            if (Emailer) {
                return res.status(500).json({
                    message: `${Emailer.email} has already been used.`
                })
            }  
            console.log(Emailer);
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
               
                const reqBody = await new resturantModel({
                    resturantName: resturantName.toUpperCase(), 
                    email: email.toLowerCase(), 
                    address,
                    image,
                    password: hashPassword,
                    comfirmPassword: hashPassword,
                    Otp: OTP
                })
    
                const savedRestaurant = await reqBody.save()
    
                const token = jwt.sign({ email: savedRestaurant.email, id: savedRestaurant._id }, process.env.Secret, { expiresIn: "333mins" });
    
                const subject = ' Kindly Verify your  Registration'
                const html = await sendMail(OTP)
                emailSender({
                    email: email,
                    subject,
                    html
                })
    
                res.status(200).json({
                    message: `${savedRestaurant.resturantName} is registered sucessfully without image`,
                    dat: savedRestaurant,
                    data: token
                })
            }
        }       
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}


const restaurantVerification = async(req, res) => {
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
       const restaurant = await resturantModel.findOne({email})

       if (!restaurant) {
        return res.status(400).json({
            message: "Email not found"
        })
       }
       if (restaurant.isVerified === true) {
        return res.status(400).json({
            message: "restaurant has already been verifield"
        })
       }

       if (!restaurant.Otp) {
        return res.status(404).json({ message: 'OTP not found' });
    }

       if (!restaurant.Otp === otp) {
        return res.status(400).json({
            message: "You have to input the correct OTP"
        })
       } else {
        restaurant.isVerified = true;
        await restaurant.save();

        await resturantModel.updateOne({ email: restaurant.email }, { Otp: null }, {new : true});

        res.status(200).json({
            message: `${restaurant.resturantName} has been verified sucessfully `
           })
    }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const findAll = async(req, res) => {
    try {
        const findall = await resturantModel.find()

        res.status(200).json({
            message: "all restaurants are "+ findall.length,
            data: findall
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}


const resentVerification = async(req,res) => {
    try {
        const {email} = req.body

        const resturant = await resturantModel.findOne({email})

        if (!resturant) {
            return res.status(500).json({
                message: "email not found"
            })
        }
        if (resturant.isVerified === true) {
            return res.status(500).json({
            message: "resturant has already been verified"
            })
        }

        const OTP = otpGenerator.generate(5, {
            digits: true,
            lowerCaseAlphabets: false,
            alphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        }).replace(/\D/g, '');
        resturant.Otp = OTP
        
           const token = jwt.sign({ email: resturant.email, id: resturant._id }, process.env.Secret, { expiresIn: "333mins" });

            const subject = ' Resend Verification'
            const html = sendMail(OTP)
            emailSender({
                email: email,
                subject,
                html
            })
            resturant.save()

            res.status(200).json({
                message: `${resturant.email} the OTP ha been sent to you`,
                data: resturant,
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

        const restaurant = await resturantModel.findOne({email})
        if (!restaurant) {
            return res.status(404).json({
                message: "restaurant not found"
            })
        }

        const checkedPassword = bcrypt.compare(password, restaurant.password)

        if (!checkedPassword) {
            return res.status(404).json({
                message: "invalid password"
            })
        }

        if (!restaurant.isVerified == true) {
            return res.status(500).json({
                message: "restaurant is not verified"
            })
        }

        const islogin = await restaurantModel.findByIdAndUpdate(restaurant._id, {isLogin: true}, {new: true});

        const token = jwt.sign({email: restaurant.email, id: restaurant._id,}, process.env.Secret, {expiresIn: "300mins"})
        islogin.save()

        res.status(200).json({
            message: 'Login sucessfully',
            data: restaurant,
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

        const restaurantId = await resturantModel.findById(id)

        const logout = await resturantModel.findByIdAndUpdate(restaurantId, {isLogin: false}, {new: true}); 
        logout.save()

        if (!restaurantId.isLogin === true) {
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

        const restaurant = await resturantModel.findOne({email})
        if (!restaurant) {
            return res.status(500).json({
                message: "restaurant not found"
            })
        }

        const token = jwt.sign({id: restaurant._id, restaurant: restaurant.email}, process.env.Secret, {expiresIn: "333mins"})

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
    
        const restaurantId = decodedToken.id;
    
        const restaurant = await resturantModel.findById(restaurantId);

        if (!restaurant) {
        return res.status(404).json({
            message: "restaurant not found"
        });
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        restaurant.password = hashedPassword;
        await restaurant.save();
    
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
        const restaurantId = decodedToken.id;

        const restaurant = await resturantModel.findById(restaurantId);
        // console.log(restaurant);

        if (!restaurant) {
            return res.status(404).json({
                message: "restaurant not found ooooo"
              });
        }
        const matchPassword = await bcrypt.compare(oldPassword, restaurant.password);
    
        if (!matchPassword) {
            return res.status(401).json({
              message: "password is incorrect."
            });
          }
    
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newPassword = await userModel.findByIdAndUpdate(restaurantId, {password: hashedPassword}, {new: true});
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


const updateRestaurant = async (req, res)=>{
    try {
        const {resturantName, email, address, image,} = req.body;
        
        const { id } = req.params;
        const restaurant = await resturantModel.findById(id);

        if(!restaurant) {
            res.status(404).json({
                message: 'restaurant not Found'
            })
        } else {
            const data = {
                resturantName: resturantName || restaurant.resturantName,
                email: email || restaurant.email,
                address: address || restaurant.address,
                image: restaurant.image
            }

            if (req.files) {
                const restaurantImage = req.files.image.tempFilePath

                const public_id = user.image.split('/').pop().split('.')[0];

                await cloudinary.uploader.destroy(public_id);
                const newImage = await cloudinary.uploader.upload(restaurantImage)
                data.image = newImage.secure_url

                const updatedImage = await resturantModel.findByIdAndUpdate(restaurant, data, {new: true});
                if (!updatedImage) {
                    res.status(400).json({
                        message: 'Could not update restaurant Info with image'
                    })
                } else {
                    res.status(200).json({
                        message: 'Successfully Updated restaurant Info with image',
                        data: updatedImage
                    })
                }
            }  else {
                const updatedUser = await resturantModel.findByIdAndUpdate(user, data, {new: true});
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
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


const oneRestaurant = async(req, res) => {
    try {
        const restaurantId = req.params.id;

        const restaurant = await resturantModel.findById(restaurantId)
        if (restaurant === 0) {
            res.status(404).json({
                message: 'No restaurant found'
            })
        } else {
            res.status(200).json({
                message: 'The restaurant Record',
                data: restaurant
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })  
    }
}

const deleteRestaurant = async (req, res) => {
    try {
      const restaurantId = req.params.id
      const restaurant = await resturantModel.findById(restaurantId);
      if (!restaurant) {
        return res.status(200).json({
          message: `${restaurant.resturantName} not found`,
        })
      }

      const public_id = restaurant.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(public_id);

      const deletedrestaurant = await resturantModel.findByIdAndDelete(restaurantId)
      res.status(200).json({
        message: 'restaurant deleted successfully',
        data: deletedrestaurant
      })
  
    } catch (error) {
      res.status(500).json({
        Error: error.message
      })
    }
  }



module.exports = {
    signUpRestaurant,
    restaurantVerification,
    resentVerification,
    login,
    signOut,
    forgetPassword,
    resetPassword,
    changePassword,
    updateRestaurant,
    oneRestaurant,
    deleteRestaurant,
    updateRestaurant,
    findAll
}
