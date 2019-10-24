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

    completeProfile_info: (req, res, next) => {
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: false
        }
        const schema = {
            birthdate: vivo.string().birthdate().required(),
            bio: vivo.string().required().min(30).max(300),
            sexual_preferences: vivo.string().alpha().min(3).max(30).required()
        }

        vivo.validate(schema, req.body)
        .then(body => next())
        .catch((error) => {
            errorObject.details = error.details;
            res.json(errorObject);
        })
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

    uploadImage: (req, res, next) => {
        
    },

    changePersonalInformations: (req, res, next) => {
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