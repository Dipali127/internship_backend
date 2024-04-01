// When the server generates a token and signs it using a secret key, the server sends the signed token back to the client. This signed token includes all the necessary information (such as user ID, roles, permissions, etc.) encoded within it, and it is typically sent back to the client in the response payload, often as a JSON object.

// The client then stores this token locally (e.g., in LocalStorage, SessionStorage, or in memory) for later use. The client includes this token in the Authorization header of subsequent requests to the server.

// Here's a simplified flow:

// Client Request: The client sends a request to the server to authenticate the user (e.g., by providing a username and password).

// Server Authentication: The server authenticates the user's credentials and, if they are valid, generates a token containing relevant user information.

// Token Signing: The server signs the token using a secret key known only to the server. This ensures that the token's integrity can be verified later.

// Token Sending: The server sends the signed token back to the client as part of the response to the authentication request.

// Token Storage: The client stores the token locally (e.g., in browser storage or in memory) for later use.

// Subsequent Requests: In subsequent requests to protected resources, the client includes the token in the Authorization header.

// Token Validation: Upon receiving a request with a token, the server verifies the token's signature using the secret key. If the signature is valid, the server decodes the token to extract user information.

// Authorization: The server uses the decoded user information to determine whether the user is authorized to access the requested resource.

// By sending the signed token back to the client, the server enables the client to securely store and transmit the token for authentication and authorization purposes in subsequent requests.

//req.headers['authorization'] accesses the value associated with the "Authorization" header in the HTTP request.
// The bracket notation ([]) allows accessing header field values 
//containing special characters, such as hyphens or spaces, which cannot be accessed using dot notation.

const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../../.env'})

//authentication:
const authentication = async function(req, res, next) {
    try {
        const token = req.headers["authorization"];
        // Check if token is provided
        if (!token) {
            return res.status(401).send({ status: false, message: "Token not provided" });
        }
        
        //token contain bearer word along with token which is extra part of token which have to be removed.
        console.log(token)
        // Split the token to remove the "Bearer" prefix
        const finalToken = token.split(' ');
        const newToken = finalToken[1];

        // Verify the token
        jwt.verify(newToken, process.env.secretKey, (error, decodedToken) => {
            if (error) {
                // Handle token verification errors
                const message = (error.message === "TokenExpiredError") ? "Token expired. Please login again" : "Invalid token";
                return res.status(400).send({ status: false, message: message });
            } else {
                // If token is valid, attach the decoded token to the request object
                req.decodedToken = decodedToken;
                next(); // Proceed to the next middleware or route handler
            }
        });

    } catch (error) {
        // Handle other errors
        return res.status(503).send({ status: false, message: error.message });
    }
};

module.exports = {authentication};