const   express = require('express');
const   app     = express();
const   userModel = require('../models/Users');
const   password_helper = require('../helpers/password_helper');
const   random = require('../helpers/random_generator');
const   mail   = require('../helpers/mail_sender');
const   _      = require('lodash');
const   jwt    = require('jsonwebtoken');

/*
**** Users controller responsible for dealing with users part (register new user, login an existing user, update user information)
**** interact witht the user model send and get informations
*/

module.exports = {
    register: async (req, res) => { // @register responsble to handle all registrations requests
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
                res.json(responseObject);
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
                res.json(responseObject);
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
            res.json(responseObject);
        } catch (error) {  // if the promise rejected end the request and send the error 
            res.send(`somthing went wrong: ${error}`);
            return;
        }

    },

    completeRegistarion: async (req, res) => { // @login responsable for every email verification request
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
                res.json(responseObject);
                return;
            }
            const tokenResult = await userModel.checkEmailVerificationHash(data); 
            if (tokenResult < 1) { // now check if the given token belong to that user if not end the request ans send the response object
                responseObject.status =  400;
                responseObject.message = "invalid token";
                res.json(responseObject);
                return;
            }
            //if the tow statements has been passed thats mean its a valid request now set the user account as verified
            const verificationMessage = await userModel.setAccountAsVerified(email); // await the promise wich contains validation message
            responseObject.status = 200; // set the status to seccessful http request
            responseObject.message = verificationMessage; // set the message
            res.json(responseObject);

        } catch (error) {  // if the promise rejected end the request and send the error 
            res.send(`somthing went wrong: ${error}`);
            return;
        }

    },

    login: async (req, res) => { // @login responsable to login users and send back JWT for every successful login operation
        const   {username , password} = req.body; // extract the username and the password from the request body
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: 400,
            message: ""
        }

        const userRow = await userModel.fetchUserWithUsername(username); // fetch the user row if its exist
        if (!userRow) {// if the username not exists set the errorObject and end the request
            errorObject.message = "Invalid username or password"; // the user should not know wich one is incorrect for security reasons
            res.json(errorObject);
            return
        }

        const isPasswordCurrect = await password_helper.password_verify(password, userRow.password); // comapre the entred password with the user password
        if (!isPasswordCurrect) { // if the password is not currect set the errorObject and end the request
            errorObject.message = "Invalid username or password"; // the user should not know wich one is incorrect for security reasons
            res.json(errorObject);
            return
        }

        if (!userRow.is_verified) { // if the username and password is currect check if the user account is verified if not set the 
            errorObject.status = 406; // 406 http status code means the request is not acceptable although the username and passowrd is correct
            errorObject.message = "Account is not verified";
            res.json(errorObject);
            return
        }

        const User = _.pick(userRow, ['id', 'username', 'firstname', 'lastname', 'email', 'longitude', 'latitude', 'is_first_visit']); //usng lodash to pick only needed informations
        const token = jwt.sign(User, process.env.PRIVATE_KEY); // sign the user token with the private key
        res.header('x-auth-token', token) // set the user token on the header
            .json(User); // send the user row in the body
    },

    forgetPassword: async (req, res) => { // @forgetPassword responsable for sending a link to reinitialize account password
        const accountExist = await userModel.fetchUserWithEmail(req.params.email); // fetch the user row with the email is its exist
        if (!accountExist) { // if the account not exist end the request with 400 status code 
            res.status(400).send('Account does not exist'); 
            return;
        }

        const token = await random(32); // generate a 32 random characters hashed
        const data = {
            token: token, 
            email: req.params.email
        }
        try { // save the token and send recovery link
            userModel.setForgetPasswordHash({token, email: req.params.email}); // save the forget password token on the user row
            mail.forgetPassword({token, email: req.params.email}); // email the user with the link
            res.status(200).send('Email has been sent'); // end the request with 200 status

        } catch (error) { // if something went wrong end the process and send the error
            res.send(`somthing went wrong: ${error}`);
            return;
        }
    }

}