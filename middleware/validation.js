const vivo = require('../helpers/vivo');

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
        const   errorObject = { // error object to store any the error message if its found
            status: false
        }
        const schema = {
            firstname: vivo.string().alpha().required().min(3).max(15),
            lastname: vivo.string().alpha().required().min(3).max(15),
            username: vivo.string().alpha().required().min(5).max(20),
            email: vivo.string().email().required(),
            password: vivo.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,36})/, 'your password should be at least one capital latter and one number and 8 characters length').required(),
            confirmPassword: vivo.string().required().ref('password'),
            gender: vivo.string().min(3).max(20).alpha().required()
        }

        vivo.validate(schema, req.body)
            .then(body =>  next() )
            .catch((error) => {
                errorObject.details = error.details;
                res.json(errorObject);
            })
    },

    login: (req, res, next) => {
        const   errorObject = { // error object to store any the error message if its found
            status: false
        }
        const schema = {
            username: vivo.string().required().alpha().min(5).max(10)
        }

        vivo.validate(schema, req.body)
            .then(body => next())
            .catch((error) => {
                errorObject.details = error.details;
                res.json(errorObject);
            })
    },

    forgetPassword: (req, res, next) => {
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: false
        }
        const schema = {
            email: vivo.string().email().required()
        }

        vivo.validate(schema, req.body)
        .then(body => next())
        .catch((error) => {
            errorObject.details = error.details;
            res.json(errorObject);
        })
    },

    reinitializePassword : (req, res, next) => {
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: false
        }
        const schema = {
            password: vivo.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,36})/, 'your password should be at least one capital latter and one number and 8 characters length'),
            confirmPassword: vivo.string().required().ref('password')
        }

        vivo.validate(schema, req.body)
        .then(body => next())
        .catch((error) => {
            errorObject.details = error.details;
            res.json(errorObject);
        })
    },

    completeProfile: (req, res, next) => {
        const { birthdate, bio, sexual_preferences } = req.body; // extract the data from the body
        const { tag0, tag1, tag2, tag3, tag4 } = req.body.tags; // extarct the tags from the tags object
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: false,
            message: ""
        }
        
        function isValidBirthdate(birthdate) {
            const [month = null, day = null, year = null] = birthdate.split('-');
            const nowDate = new Date();

            if (day === null || month === null || year === null)
                return (false);
            if ((parseInt(day) !== NaN) && (parseInt(month) !== NaN) && (parseInt(year) !== NaN))
            {
                if ((parseInt(day) > 0 && parseInt(day) <= 31) && (parseInt(month) > 0 && parseInt(month) <= 12) && (parseInt(year) < nowDate.getFullYear()))
                    return (true);
                else
                    return (false)
            } else {
                return (false);
            }
        }
        
        if (bio && sexual_preferences && tag0 && tag1 && tag2 && tag3 && tag4) {

            if (!isValidBirthdate(birthdate)) // if the value is not a number
                errorObject.message = "invalid birthdate";
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
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: false
        }
        const schema = {
            newPassword: vivo.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,36})/, 'your password should be at least one capital latter and one number and 8 characters length'),
            confirmNewPassword: vivo.string().required().ref('password')
        }

        vivo.validate(schema, req.body)
        .then(body => next())
        .catch((error) => {
            errorObject.details = error.details;
            res.json(errorObject);
        })
    },

    changePersonalInformations: (req, res, next) => {
        const   { username, firstname, lastname, email, gender, birthdate, sexual_preferences, bio } = req.body; // extract the information sent in the request
        const   old = req.body.decodedObject; // the old information from the user row (added by the auth middleware)
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: false
        }
        const schema = {
            firstname: vivo.string().alpha().required().min(3).max(15),
            lastname: vivo.string().alpha().required().min(3).max(15),
            username: vivo.string().alpha().required().min(5).max(20),
            email: vivo.string().email().required(),
            gender: vivo.string().min(3).max(20).alpha().required(),
            birthdate: vivo.string().required().birthdate(),
            sexual_preferences: vivo.string().alpha().required().min(3).max(15),
            bio: vivo.string().min(100).max(500)
        }

        vivo.validate(schema, req.body)
        .then(body => next())
        .catch((error) => {
            errorObject.details = error.details;
            res.json(errorObject);
        })
    }
}