const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

const emailSender = async (options)=>{
    const transport = nodemailer.createTransport({
        host:"smtp.gmail.com",
        service: "Gmail",
        port: 2525,
        auth: {
          user: "alexandravera789@gmail.com",
          pass: "vzfzpgznmargflne"
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    const mailOptions = {
        from: process.env.USER,
        to: options.email,
        subject: options.subject,
        html: options.html
    }
    await transport.sendMail(mailOptions)
};

module.exports = emailSender;

