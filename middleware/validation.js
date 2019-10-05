
/*
*** This module exports all middlewares responsable for validating forms ***
*** @register : This middleware is responsable for validating registration forms 
*** @changePassword : This middleware is responsable for validating the new password
*** @forgetPassword : validate if the email is a valid email
*** @reinitializePassword : Check if the new password is srtong and password and confirm pass is matched
*** @completeProfile : Validate the complete profile form
*/

module.exports = {
    register: (req, res, next) => {
        const   { firstname, lastname, username, email, password, confirmPassword, gender } = req.body; // using objects destructuring to extract only needed informations from the request body
        const   errorObject = { // error object to store any the error message if its found
            status: false,
            message: ""
        }

        function emailIsValid (email) { // using regex to check if its a valid email ex: emailname@domain.con
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        }

        function strongPassword(password) { // using regex to check if the password is strong enough : at least 8 characters one capital latter and one special character
            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,36})");
            return strongRegex.test(password);
        }

        if (firstname && lastname && username && gender && email && password) {
            if (gender.trim().length < 3)
                errorObject.message = "Invalid gender";
            if (firstname.trim().length < 3)
                errorObject.message = "Invalid firstname";
            if (lastname.trim().length < 3)
                errorObject.message = "Invalid lastname";
            if (username.trim().length < 3)
                errorObject.message = "Invalid username";
            if(!emailIsValid(email))
                errorObject.message = "Invalid email";
            if(!strongPassword(password))
                errorObject.message = "Please enter a strong password";
            if (password !== confirmPassword)
                errorObject.message = "Password does not match";
            
            if (!errorObject.message) // if error message is empty thats mean all test has been passed with no error so pass controll to the next middlware 
                next();
            else // end up the request and send back the error object
                res.json(errorObject);
        } else {
            errorObject.message = "All informations are required";
            res.json(errorObject);
        }
    },

    login: (req, res, next) => {
        const   { username, password } = req.body; // using objects destructuring to extract only needed informations from the request body
        const   errorObject = { // error object to store any the error message if its found
            status: false,
            message: ""
        }

        if (username && password) {
            if (username.trim().length < 3)
                errorObject.message = "Invalid username";
            if (password.trim().length < 8)
                errorObject.message = "Invalid firstname";
            if (!errorObject.message) // if error message is empty thats mean all test has been passed with no error so pass controll to the next middlware 
                next();
            else // end up the request and send back the error object
                res.json(errorObject);
        } else {
            errorObject.message = "All informations are required";
            res.json(errorObject);
        }
    },

    forgetPassword: (req, res, next) => {
        const email = req.params.email;
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: false,
            message: ""
        }

        function emailIsValid (email) { // using regex to check if its a valid email ex: emailname@domain.con
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        if (!emailIsValid(email)) { // end the request and return a 400 status code
            errorObject.message = "Invalid email"; // set the error message
            res.json(errorObject);
        }
        next(); // email is valid move to the next middleware
    },

    reinitializePassword : (req, res, next) => {
        const {password, confirmPassword} = req.body; // extract password and confirm password
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: false,
            message: ""
        }

        function strongPassword(password) { // using regex to check if the password is strong enough : at least 8 characters one capital latter and one special character
            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            return strongRegex.test(password);
        }
        if (!strongPassword(password)) { // if the password if not strong end the request 
            errorObject.message = "Please enter a strong password";
            res.json(errorObject);
            return;
        }
        if (password !== confirmPassword) { // if the passwords not match end the request
            errorObject.message = "Password does not match";
            res.json(errorObject);
            return;
        }
        next(); // if all the statments has been passed with no error call to the next middleware
    },

    completeProfile: (req, res, next) => {
        const { age, bio, sexual_preferences } = req.body; // extract the data from the body
        const { tag0, tag1, tag2, tag3, tag4 } = req.body.tags; // extarct the tags from the tags object
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: false,
            message: ""
        }
        
        if (age && bio && sexual_preferences && tag0 && tag1 && tag2 && tag3 && tag4) {

            if (!Number.isInteger(age)) // if the value is not a number
                errorObject.message = "please enter a valid number";
            if (bio.trim().length < 30)
                errorObject.message = "at least you should write a 30 characters";
            if (bio.trim().length > 599) 
                errorObject.message = "you cant write more than 600 characters";
            if (sexual_preferences.trim().length < 3)
                errorObject.message = "Invalid choice";
            if (tag0.trim().length < 3)
                errorObject.message = "Invalid tag";
            if (tag1.trim().length < 3)
                errorObject.message = "Invalid tag";
            if (tag2.trim().length < 3)
                errorObject.message = "Invalid tag";
            if (tag3.trim().length < 3)
                errorObject.message = "Invalid tag";
            if (tag4.trim().length < 3)
                errorObject.message = "Invalid tag";

            if (!errorObject.message) // if error message is empty thats mean all test has been passed with no error so pass controll to the next middlware 
                next();
            else // end up the request and send back the error object
                res.json(errorObject);

        } else {
            errorObject.message = "all informations are required";
            res.json(errorObject);
        }
    },

    changePassword: (req, res, next) => {
        const { newPassword, confirmNewPassword } = req.body; // extract the data from the response object
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: false,
            message: ""
        }

        function strongPassword(password) { // using regex to check if the password is strong enough : at least 8 characters one capital latter and one special character
            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            return strongRegex.test(password);
        }

        if (!strongPassword(newPassword)) { // if the password if not strong end the request 
            errorObject.message = "Please enter a strong password";
            res.json(errorObject);
            return;
        }
        if (newPassword !== confirmNewPassword) { // if the passwords not match end the request
            errorObject.message = "Password does not match";
            res.json(errorObject);
            return;
        }
        next(); // if all the statments has been passed with no error call to the next middleware
    },

    changePersonalInformations: (req, res, next) => {
        const   { username, firstname, lastname, email, gender, age, sexual_preferences, bio } = req.body; // extract the information sent in the request
        const   old = req.body.decodedObject; // the old information from the user row (added by the auth middleware)
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: false,
            message: ""
        }

        function emailIsValid (email) { // using regex to check if its a valid email ex: emailname@domain.con
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        if (username !== old.username) { // if the user set a new username
            if (username.trim().length < 6) // validate the new username
                errorObject.message = "Invalid username";
        }
        if (firstname !== old.firstname) { 
            if (firstname.trim().length < 6)
                errorObject.message = "Invalid firstname";
        }
        if (lastname !== old.lastname) { 
            if (lastname.trim().length < 6)
                errorObject.message = "Invalid lastname";
        }
        if (email !== old.email) { 
            if (!emailIsValid(email))
                errorObject.message = "Invalid email";
        }   
        if (gender !== old.gender) { 
            if (gender.trim().length < 3)
                errorObject.message = "Invalid gender";
        }
        if (age !== old.age) { 
            if (!Number.isInteger(age)) // if the value is not a number
                errorObject.message = "please enter a valid number";
        }
        if (sexual_preferences !== old.sexual_preferences) { 
            if (sexual_preferences.trim().length < 3)
                errorObject.message = "Invalid choice";
        }
        if (bio !== old.bio) { 
            if (bio.trim().length < 30)
                errorObject.message = "at least you should write a 30 characters";
            if (bio.trim().length > 599) 
                errorObject.message = "you cant write more than 600 characters";
        }
        
        if (!errorObject.message) // if error message is empty thats mean all test has been passed with no error so pass controll to the next middlware 
            next();
        else // end up the request and send back the error object
            res.json(errorObject);
    }
}