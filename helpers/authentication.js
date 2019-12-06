const jwt  = require('jsonwebtoken');
const chatModel = require('../models/Chat');

module.exports = {
    
    verify: async (token) => {

                const responseObject = {
                    status: false,
                }
                try { // Now verify the token if is valid its return the payload object if ! its throw an exception
                    await jwt.verify(token, process.env.PRIVATE_KEY, async (error, decoded) => {
                        if (!error) { // if there is no error its a valid token

                            const userExist = await chatModel.userExists(decoded.id);
                            if (userExist > 0){
                                responseObject.status = true;
                                responseObject.userId = decoded.id;
                            }
                            else {
                                return;
                            }
                        } else {
                            return;
                        }
                    });
                    return responseObject;
                } catch (error) { // if the token is invalid send a 400 status code and end the request
                    return responseObject;
                }
            }
}
