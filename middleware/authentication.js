const jwt = require("jsonwebtoken");

// auth middleware
const userAuth = async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const hasAuthorization = req.headers.authorization;
        const token = hasAuthorization.split(" ")[1];
  
        if (hasAuthorization) {
          next();
        } else {
          res.status(401).json({
            message: "please login",
          });
        }
      } else {
        res.status(404).json({
          message: "No authorization found, please login",
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

module.exports = {
    userAuth
}