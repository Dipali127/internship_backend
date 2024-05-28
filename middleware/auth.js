const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../.env'})

//Authentication:
const authentication = async function(req, res, next) {
    try {
        const token = req.headers["authorization"];
        //Check if token is provided
        if (!token) {
            return res.status(401).send({ status: false, message: "Token not provided" });
        }
        
        // The token might contain the word "Bearer" as a prefix, which needs to be removed.
        //Split the token to remove the "Bearer" prefix
        const finalToken = token.split(' ');
        const newToken = finalToken[1];

        //Verify the token
        jwt.verify(newToken, process.env.secretKey, function (error, decodedToken) {
            if (error) {
                //Check for token expiration
                if (error instanceof jwt.TokenExpiredError) {
                    return res.status(400).send({ status: false, message: "Token expired, please login again" });
                }
                //Handle other errors
                return res.status(400).send({ status: false, message: "Invalid token" });
            } else {
                req.decodedToken = decodedToken;
                //Proceed to the next middleware or route handler
                next(); 
            }
        });
    } catch(error) {
        return res.status(503).send({ status: false, message: error.message });
    }
    
};

module.exports = {authentication}