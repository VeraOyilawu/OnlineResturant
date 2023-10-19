const randomstring = require("randomstring")

 const genOtp = () => {
    try {
        const OTP = randomstring.generate({
            length: 4,     // Length of the OTP
            charset: 'numeric', // Use numeric characters for OTP
          });
          return OTP
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
  }

  module.exports = genOtp

