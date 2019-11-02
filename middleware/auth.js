const   jwt    = require('jsonwebtoken');

/*
*** this middleware is responsable of verifying if the request has a valid authentication token
*/

module.exports = (req, res, next) => { // take the request and check the header if its contain a valid token
    const authorization = req.header('Authorization'); // extract the token from the header
    let token;

    if ( authorization ) // checks if the autorization header is set
        token = authorization.split(' ')[1];
    const   errorObject = { // the error object ro treturn in case of error
        status: false,
        message: ""
    };

    if(!token) {// first of all check if there is any token if not end the request and set the error object
        errorObject.message = 'Access denied. No token provided';
        res.json(errorObject);
        return;
    }

    try { // Now verify the token if is valid its return the payload object if ! its throw an exception
        jwt.verify(token, process.env.PRIVATE_KEY, (error, decoded) => {
            if (!error) { // if there is no error its a valid token
                req.decodedObject = decoded; // put the decoded object (Payload) in the request body
                next(); // call to the next middleware
            } else {
                errorObject.message = 'Access denied. Invalid token provided';
                res.json(errorObject);
            }
        });

    } catch (error) { // if the token is invalid send a 400 status code and end the request
        res.send(`something went wrong error: ${error}`)
    }
}