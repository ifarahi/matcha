const   express = require('express');
const   app     = express();
const   userModel = require('../models/Users');
const   password_helper = require('../helpers/password_helper');
const   random = require('../helpers/random_generator');
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
            row: {} // the user row if the user has beend successfully registred
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
            responseObject.row = userRow;
            responseObject.status = 200;
            responseObject.message = "user has been registred";
            res.send(JSON.stringify(userRow));
        } catch (error) {  // if the promise rejected end the request and send the error 
            res.send(`somthing went wrong: ${error}`);
            return;
        }

    },

    login: function () {

    }
}