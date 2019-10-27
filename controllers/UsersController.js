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
                responseObject.message = "Username is already exists";
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
                responseObject.message = "email is already exists";
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

        const User = _.pick(userRow, ['id', 'username', 'firstname', 'lastname', 'age', 'gender', 'bio', 'sexual_preferences', 'email', 'longitude', 'latitude', 'is_first_visit']); //usng lodash to pick only needed informations
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
    
    changePassword: async (req, res) => { // change user password 
        const { oldPassword, newPassword } = req.body; // extract the data from the request body
        const { id } = req.decodedObject; // extract the user id from the decoded object added by the auth middleware
        const data = { // the data object wich will used in updateUserPassword method 
            id,
            password: await password_helper.password_hash(newPassword), // hash the password before insert it into the database
        }
        const responseObject = { // the response object to be sent back
            status: false,
            message: ""
        }

        const user = await userModel.fetchUserWithId(id); // fetch the user row
        const isPasswordCurrect = await password_helper.password_verify(oldPassword, user.password); // comapre the old password with the user password
        if (!isPasswordCurrect) { // if the password is not currect set the responseObject and end the request
            responseObject.message = "Incurrect old password"; // the user should not know wich one is incorrect for security reasons
            res.json(responseObject);
            return
        }
        
        try { // if the old password is currect now change the user password to the newPasword
            userModel.updateUserPassword(data);
            responseObject.status = true;
            responseObject.message = "Your password is successfully updated";
            res.json(responseObject);
        } catch (error) {
            res.send(`somting went wrong error: ${error}`);
        }
    },

    changePersonalInformations: async (req, res) => { // update a user personal information (only login users)
        const   { username, firstname, lastname, email, gender, age, sexual_preferences, bio } = req.body; // extract the information sent in the request
        const   old = req.decodedObject; // the old information from the user row (added by the auth middleware)
        let     change = 0; // this change will be 1 if the user has changed at least one of their personal information
        const   responseObject = { // init the responseObject to be sent back
            status: false,
            message: ""
        }

        // if the user profile not completed cannot update this information the request should be end
        if (old.is_first_visit === 1) { // check if the user profile is not complete (old is the decodedObject added by the middleware containing the user information)
            responseObject.message = "Your profile is not complete you cant update this information"
            res.json(responseObject);
            return;
        }

        if (username !== old.username) { // if the user set a new username check if that username is not already exists
            try { // if the username is already exists the process will stop here otherwise will go to the next statement
                const usernameResult = await userModel.usernameExists(username); 
                if (usernameResult) { // if username is already exists set up the response object and end the reqeust
                    responseObject.message = "Username is already exists";
                    res.json(responseObject);
                    return;
                } else {
                    change = 1; // set the change to 1 and move to the next statement
                }
            } catch (error) {  // if the promise rejected end the request and send the error 
                res.send(`something went wrong: ${error}`);
                return;
            }
        }
        if (email !== old.email) { // if the user set a new email check if that username is not already exists
            try { // if the email is already exists the process will stop here otherwise will go to the next statement
                const emailResult = await userModel.emailExists(email);
                if (emailResult) { // if email is already exists set up the response object and end the reqeust
                    responseObject.message = "email is already exists";
                    res.json(responseObject);
                    return;
                } else {
                    change = 1; // set the change to 1 and move to the next statement
                }
            } catch (error) { // if the promise rejected end the request and send the error 
                res.send(`something went wrong: ${error}`);
                return;
            }
        } 
        if (firstname !== old.firstname) { 
            change = 1;
        }
        if (lastname !== old.lastname) { 
            change = 1;
        }
        if (gender !== old.gender) { 
            change = 1;
        }
        if (age !== old.age) { 
            change = 1;
        }
        if (sexual_preferences !== old.sexual_preferences) { 
            change = 1;
        }
        if (bio !== old.bio) { 
            change = 1;
        }

        if (change === 0) { // if change is still 0 thats mean nothing has been change end the request
            responseObject.status = true;
            responseObject.message = "Nothing has been changed";
            res.json(responseObject);
            return;

        } else { // if the change is not 0 thats mean the user changed one or more personal information update the database
            const   data = { // init the data object to be used on updating the database
                id: old.id, // extract the user id from the decoded object wich is copyed to a variable called old
                username,
                firstname,
                lastname,
                email,
                gender,
                age,
                sexual_preferences,
                bio
            }

            try { // now update the user data
                const result = await userModel.updateUserPersonalInformations(data);
                if (result) { // if the data is currectly inserted set the response object and end the request
                    responseObject.status = true;
                    responseObject.message = "Your information has been updated";
                    res.json(responseObject);
                }
            } catch (error) {
                res.send(`something went wrong: ${error}`);
                return;
            }
        }
    },

    testUser: async (req, res) => {
        const {username} = req.body;
        const userRow = 
        res.send(userRow.email);
    }

}