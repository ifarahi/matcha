const   userModel = require('../models/Users');
const   password_helper = require('../helpers/password_helper');
const   random = require('../helpers/random_generator');
const   mail   = require('../helpers/mail_sender');
const   _      = require('lodash');
const   jwt    = require('jsonwebtoken');

module.exports = {
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
        const   { username, firstname, lastname, email, gender, birthdate, sexual_preferences, bio } = req.body; // extract the information sent in the request
        const   old = req.decodedObject; // the old information from the user row (added by the auth middleware)
        let     change = 0; // this change will be 1 if the user has changed at least one of their personal information
        const   responseObject = { // init the responseObject to be sent back
            status: false,
            message: ""
        }

        // if the user profile not completed cannot update this information the request should be end
        if (old.is_first_visit === 1) { // check if the user profile is not complete (old is the decodedObject added by the middleware containing the user information)
            responseObject.message = "Your profile is not completed yet you cant update this information"
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
        if (birthdate !== old.birthdate) { 
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
            responseObject.message = "Your information is up to date";
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
                birthdate,
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
    }
}