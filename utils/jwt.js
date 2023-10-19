const jwt = require()
const userModel = require("../Models/userModel");
require('dotenv').config()

const genToken = async (id, time) => {
    const token = await jwt.sign(
        {
            userId: id
        },
        process.env.jwt_Secret,
        {
            expiresIn: time
        }
    )
    return token;
};

const decodeToken = async (token) => {
    let user = null;
    await jwt.verify(token, process.env.jwt_Secret, async (err, data) => {
        if(err) {
            return res.status(200).json({
                message: 'Token Expired, Please try again'
            });
        } else {
            user = await userModel.findById(data.userId);
        }
    })
    return user
};

module.exports = {
    genToken,
    decodeToken
}