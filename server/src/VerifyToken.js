var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require("./Config"); // get our config file

function verifyToken(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.headers['x-access-token'];
    //var token = req.get('Content-Type');
    if (!token) {
        console.log("userID Error: " + token);
        next();
    } else {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                req.userID = 0;
            } else {
                // if everything is good, save to request for use in other routes
                req.userID = decoded.id;
            }
            console.log("userID: " + req.userID);
            next();
        });
    }

}

module.exports = verifyToken;