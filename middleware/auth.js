const   jwt    = require('jsonwebtoken');

/*
*** this middleware is responsable of verifying if the request has a valid authentication token
*/

module.exports = (req, res, next) => { // take the request and check the header if its contain a valid token
    const   token = req.header('x-auth-token'); // extract the token from the header
    if(!token) // first of all check if there is any token if not end the request with a 401 status code
        res.status(401).send('Access denied. No token provided');

    try { // Now verify the token if is valid its return the payload object if ! its throw an exception
        const decodedObject = jwt.verify(token, process.env.PRIVATE_KEY);
        req.body.decodedObject = decodedObject; // put the decoded object (Payload) in the request body
        next(); // call to the next middleware
        return;
    } catch (ex) { // if the token is invalid send a 400 status code and end the request
        res.status(400).send('Invalid token');
    }
}