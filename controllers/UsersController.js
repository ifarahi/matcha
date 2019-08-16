const   express = require('express');
const   app     = express();
const   userModel = require('../models/Users');
const   password_helper = require('../helpers/password_helper');
const   random = require('../helpers/random_generator');
const   mail   = require('../helpers/mail_sender');
/*
**** Users controller responsible for dealing with users part (register new user, login an existing user, update user information)
**** interact witht the user model send and get informations
*/

module.exports = {
    register: async (req, res) => { // using async function to await the returned promise from userModel methods
        const   { firstname, lastname, username, gender, email, password } = req.body; // using objects destructuring to extract only needed informations from the request body
        const data = { // prepare the user data to be stored in the database (hash the password)
            firstname,
            lastname,
            username,
            gender,
            email,
            password: await password_helper.password_hash(password),
            verify_email_hash: await random(32) // Genrate a random 32 lenght string hashed in md5 to be used in email verification
        }
        const responseObject = { // the response object to be send back
            status: 0, // response status
            message: "", // message (error type in case on error, OK message in case os success)
        }

        try { // if the username is already exists the process will stop here otherwise will go to the next statement
            const usernameResult = await userModel.usernameExists(username); 
            if (usernameResult) { // if username is already exists set up the response object and end the reqeust
                responseObject.status = 409;
                responseObject.message = "Username is already exists";
                res.send(JSON.stringify(responseObject));
                return;
            }
        } catch (error) {  // if the promise rejected end the request and send the error 
            res.send(`somthing went wrong: ${error}`);
            return;
        }

        try { // if the email is already exists the process will stop here otherwise will go to the next statement
            const emailResult = await userModel.emailExists(email);
            if (emailResult) { // if email is already exists set up the response object and end the reqeust
                responseObject.status = 409;
                responseObject.message = "email is already exists";
                res.send(JSON.stringify(responseObject));
                return;
            }
        } catch (error) { // if the promise rejected end the request and send the error 
            res.send(`somthing went wrong: ${error}`);
            return;
        }

        try { // call the userModel method register if the user is registred end up the request and send 200 status
            const userRow = await userModel.register(data);
            responseObject.status = 200;
            responseObject.message = "user has been registred";
            mail.completeRegistarion(data); // send complete resgistration mail
            res.send(JSON.stringify(responseObject));
        } catch (error) {  // if the promise rejected end the request and send the error 
            res.send(`somthing went wrong: ${error}`);
            return;
        }

    },

    completeRegistarion: async (req, res) => {
        const { email, token} = req.params; // extract the email and token from the req.params object
        const responseObject = { // the response object to be send back
            status: 0, // response status
            message: "", // message (error type in case on error, OK message in case os success)
        }
        const data = { // the data object wich will be send on checkEmailVerificationHash to make sure the token is belong to the user
            email,
            token,
        }

        try { // check if the user exits and if the given token is belong to that user
            const emailResult = await userModel.emailExists(email); 
            if (emailResult < 1) { // check if the user is exist if not end the request and send the response object
                responseObject.status =  400;
                responseObject.message = "user not found";
                res.send(JSON.stringify(responseObject));
                return;
            }
            const tokenResult = await userModel.checkEmailVerificationHash(data); 
            if (tokenResult < 1) { // now check if the given token belong to that user if not end the request ans send the response object
                responseObject.status =  400;
                responseObject.message = "invalid token";
                res.send(JSON.stringify(responseObject));
                return;
            }
            //if the tow statements has been passed thats mean its a valid request now set the user account as verified
            const verificationMessage = await userModel.setAccountAsVerified(email); // await the promise wich contains validation message
            responseObject.status = 200; // set the status to seccessful http request
            responseObject.message = verificationMessage; // set the message
            res.send(JSON.stringify(responseObject));

        } catch (error) {  // if the promise rejected end the request and send the error 
            res.send(`somthing went wrong: ${error}`);
            return;
        }

    }
}