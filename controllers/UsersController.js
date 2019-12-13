const   express = require('express');
const   app     = express();
const   userModel = require('../models/Users');
const   password_helper = require('../helpers/password_helper');
const   random = require('../helpers/random_generator');
const   mail   = require('../helpers/mail_sender');
const   _      = require('lodash');
const   jwt    = require('jsonwebtoken');
// const   tagRemover = require('../helpers/tagRemover');

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
            password: await password_helper.password_hash(password), // hash the password before insert it into the database
            verify_email_token: await random.generate(32) // Genrate a random 32 lenght string hashed in md5 to be used in email verification
        }
        const responseObject = { // the response object to be send back
            status: false, // response status
            message: "" // message (error type in case on error, OK message in case os success)
        }

        try { // if the username is already exists the process will stop here otherwise will go to the next statement
            const usernameResult = await userModel.usernameExists(username); 
            if (usernameResult) { // if username is already exists set up the response object and end the reqeust
                responseObject.details = {username: "Username is already exists"};
                res.json(responseObject);
                return;
            }
        } catch (error) {  // if the promise rejected end the request and send the error 
            res.send(`something went wrong: ${error}`);
            return;
        }

        try { // if the email is already exists the process will stop here otherwise will go to the next statement
            const emailResult = await userModel.emailExists(email);
            if (emailResult) { // if email is already exists set up the response object and end the reqeust
                responseObject.details = {email: "email is already exists"};
                res.json(responseObject);
                return;
            }
        } catch (error) { // if the promise rejected end the request and send the error 
            res.send(`something went wrong: ${error}`);
            return;
        }

        try { // call the userModel method register if the user is registred end up the request and send 200 status
            const userRow = await userModel.register(data);
            responseObject.status = true;
            responseObject.message = "Please check your email to complete your registration";
            mail.completeRegistarion(data); // send complete resgistration mail
            res.json(responseObject);
        } catch (error) {  // if the promise rejected end the request and send the error 
            res.send(`something went wrong: ${error}`);
            return;
        }

    },

    completeRegistarion: async (req, res) => { // @login responsable for every email verification request
        const { email, token} = req.params; // extract the email and token from the req.params object
        const responseObject = { // the response object to be send back
            status: false, // response status
            message: "", // message (error type in case on error, OK message in case os success)
        }
        const data = { // the data object wich will be send on checkEmailVerificationHash to make sure the token is belong to the user
            email,
            token,
        }

        try { // check if the user exits and if the given token is belong to that user
            const emailResult = await userModel.emailExists(email); 
            if (emailResult < 1) { // check if the user is exist if not end the request and send the response object
                responseObject.message = "user not found";
                res.json(responseObject);
                return;
            }
            const tokenResult = await userModel.checkEmailVerificationToken(data); 
            if (tokenResult < 1) { // now check if the given token belong to that user if not end the request ans send the response object
                responseObject.message = "invalid token";
                res.json(responseObject);
                return;
            }
            //if the tow statements has been passed thats mean its a valid request now set the user account as verified
            userModel.setAccountAsVerified(email); // verify user account
            responseObject.status = true; // set the status to seccessful http request
            responseObject.message = "Your account has been verified you can now login"; // set the message
            res.json(responseObject);

        } catch (error) {  // if the promise rejected end the request and send the error 
            res.send(`something went wrong: ${error}`);
            return;
        }

    },

    login: async (req, res) => { // @login responsable to login users and send back JWT for every successful login operation
        const   {username , password} = req.body; // extract the username and the password from the request body
        const   responseObject = { // the error object to be send back
            status: false,
            message: ""
        }

        const userRow = await userModel.fetchUserWithUsername(username); // fetch the user row if its exist
        if (!userRow) {// if the username not exists set the errorObject and end the request
            responseObject.message = "Invalid username or password"; // the user should not know wich one is incorrect for security reasons
            res.json(responseObject);
            return
        }

        const isPasswordCurrect = await password_helper.password_verify(password, userRow.password); // comapre the entred password with the user password
        if (!isPasswordCurrect) { // if the password is not currect set the errorObject and end the request
            responseObject.message = "Invalid username or password"; // the user should not know wich one is incorrect for security reasons
            res.json(responseObject);
            return
        }

        if (!userRow.is_verified) { // if the username and password is currect check if the user account is verified if not set the 
            try {
                const userRow = await userModel.fetchUserWithUsername(username); //get the user email with the given username
                const   data = { // the data object so set a new verification token in case the user didn't recieve the verification email
                    email: userRow.email,
                    verify_email_token: await random.generate(32) // Genrate a random 32 lenght string hashed in md5 to be used in email verification
                }

                userModel.setNewEmailConfirmationToken(data)
                mail.completeRegistarion(data); // send complete resgistration mail
                responseObject.message = "Account is not verified, We have sent you a new email to complete your registration";
                res.json(responseObject);
                return
            } catch (error) {  // if the promise rejected end the request and send the error 
                res.send(`something went wrong: ${error}`);
                return;
            }
        }

        const User = _.pick(userRow, ['id', 'username', 'firstname', 'lastname', 'age', 'gender', 'bio', 'profile_picture', 'birthdate', 'sexual_preferences', 'email', 'longitude', 'latitude', 'is_first_visit']); //usng lodash to pick only needed informations
        const token = await jwt.sign(User, process.env.PRIVATE_KEY); // sign the user token with the private key
        responseObject.status = true; // set the response status to true (user is currectly logged in)
        responseObject.user = User; // include the user data in the response object
        responseObject.token = token // set the user token on the header
            res.json(responseObject); // send the user row in the body
    },

    forgetPassword: async (req, res) => { // @forgetPassword responsable for sending a link to reinitialize account password
        const   responseObject = { // the response object to be send back
            status: false,
            message: ""
        }

        const accountExist = await userModel.fetchUserWithEmail(req.params.email); // fetch the user row with the email is its exist
        if (!accountExist) { // if the account not exist set the response object with error message
            responseObject.message = 'Account does not exist';
            res.json(responseObject);
            return;
        }

        const token = await random.generate(16); // generate a 16 random characters 
        const data = { // the data wich will be used to store the token on the user db and email the user with the token
            token: token, 
            email: req.params.email
        }

        try { // save the token and send recovery link
            userModel.setForgetPasswordToken(data); // save the forget password hashedToken on the user row
            mail.forgetPassword(data); // email the user with the link
            responseObject.status = true; // set the response status to true (recovery email has been sent)
            responseObject.message = 'An email with the password re-initialization token has been sent'; // 
            res.json(responseObject);

        } catch (error) { // if something went wrong end the process and send the error
            res.send(`something went wrong: ${error}`);
            return;
        }
    },

    isValidToken : async (req, res) => { // verify if the token is valid 
        const   responseObject = { // the response object to be send back
            status: false,
            message: ""
        }

        const isValidToken = await userModel.isValidToken(req.params.token); // check if there is a user with the given token
        if (isValidToken < 1) { // if there is not user with this recovery token end the request
            responseObject.message = 'Token does not exist'; // error message
            res.json(responseObject);
            return;
        } else { // if it's exist return a true status
            responseObject.status = true;
            responseObject.message = 'Valid token'; // error message
            res.json(responseObject);
        }
    },

    reinitializePassword: async (req, res) => { // re-initialize user password with the give token
        const {token, password} = req.body; // extract data from the request body
        const   responseObject = { // the response object to be send back
            status: false,
            message: ""
        }

        const userRow = await userModel.fetchUserWithRecoveryToken(token); // fetch the user with the recovery token is it's exist
        if (!userRow) { // if there is no user with the give token end the request
            responseObject.message = 'Token does not exist'; // error message
            res.json(responseObject);
            return;
        }
        try { // update the user password
            const hashedPassword = await password_helper.password_hash(password); // hash the user password to be stored on the database
            const data = { // data object wich will be used with updateUserPassword() on the userModel
                id: userRow.id, // extract the user id from the user row
                password: hashedPassword
            }
            const result = await userModel.updateUserPassword(data); // update the user password

            if (result) { // if the password is updated send a response with 200 status code
                userModel.unsetForgetPasswordToken(data.id); // unset the password re-initialization token so it cant be used anymore
                responseObject.status = true; // a true status value means the password has been updated
                responseObject.message = "Your password has been successfuly updated";
                res.json(responseObject);
            }

        } catch (error) {
            res.send(`somting went wrong error: ${error}`);
        }
    },
    
    getPersonalInformation: async (req, res) => {
        const {id} = req.params;
        const responseObject = {
            status: true
        }

        try {
            const userRow = await userModel.fetchUserWithId(id);
            if (userRow) {
                responseObject.user = _.pick(userRow, ['username', 'firstname', 'lastname', 'age', 'gender', 'bio', 'sexual_preferences', 'birthdate', 'email', 'longitude', 'latitude']); //usng lodash to pick only needed informations
                res.json(responseObject);
            } else {
                responseObject.status = false;
                responseObject.message = 'User does not exist';
                res.json(responseObject);
            }
        } catch (error) {
            responseObject.status = false;
            responseObject.message = error;
            res.json(responseObject);
        }
    },

    authenticate : async (req, res) => { // verify if the token is valid 
        res.json({
            status : true,
            message : 'Your authentication token is valid'
        })
    },

    updateAuthToken: async (req, res) => {
        const {username} = req.decodedObject;
        const responseObject = {
            status: true,
            message: ''
        }

        try {
            const userRow = await userModel.fetchUserWithUsername(username); //get the user email with the given username
            const User = _.pick(userRow, ['id', 'username', 'firstname', 'lastname', 'age', 'gender', 'bio', 'profile_picture', 'sexual_preferences', 'email', 'longitude', 'latitude', 'is_first_visit']); //usng lodash to pick only needed informations
            const token = await jwt.sign(User, process.env.PRIVATE_KEY); // sign the user token with the private key
            responseObject.user = User; // include the user data in the response object
            responseObject.token = token // set the user token on the header
            res.json(responseObject); // send the user row in the body
        } catch (error) {
            responseObject.status = false;
            responseObject.message = error;
            res.json(responseObject);
        }
    },

    updateLastLogged : async ( userId ) => {
        try {
            if ( userId ) {
                const result = await ( userModel.userExists( userId ) );
                if ( result > 0 ) {       
                    await userModel.updateLastLogged( userId );
                }
            }
        } catch ( e ) {

        }
    }

}