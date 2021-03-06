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
            .then((body) => {
                const {gender} = req.body;
                if ((gender !== 'Men') && (gender !== 'Women') && (gender !== 'Other')) {
                    errorObject.details = { gender: 'Invalid option' };
                    res.json(errorObject);
                    return;
                } else {
                    next();
                }
            })
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
        const data = {
            email: req.params.email
        }

        vivo.validate(schema, data)
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
            confirmPassword: vivo.string().required().ref('password'),
            token: vivo.string().required().max(300)
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
            status: false,
            details: ''
        }
        const schema = {
            birthdate: vivo.string().birthdate().required(),
            bio: vivo.string().required().min(30).max(300),
            sexual_preferences: vivo.string().alpha().min(3).max(30).required()
        }

        vivo.validate(schema, req.body)
        .then((body) => {
            const {sexual_preferences} = req.body;
            if ((sexual_preferences !== 'Men') && (sexual_preferences !== 'Women') && (sexual_preferences !== 'Other')) {
                errorObject.details = { sexual_preferences: 'Invalid option' };
                res.json(errorObject);
                return;
            } else {
                next();
            }
        })
        .catch((error) => {
            errorObject.details = error.details;
            res.json(errorObject);
        })
    },

    changePassword: (req, res, next) => {
        const   errorObject = { // init the error object wich will be returned as a response in case of error
            status: false,
            message: 'Invalid information'
        }
        const schema = {
            newPassword: vivo.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,36})/, 'your password should be at least one capital latter and one number and 8 characters length'),
            confirmNewPassword: vivo.string().required().ref('newPassword')
        }

        vivo.validate(schema, req.body)
        .then(body => next())
        .catch((error) => {
            errorObject.details = error.details;
            res.json(errorObject);
        })
    },

    confirmEmail: (req, res, next) => {
        const {email, token} = req.params;
        const errorObject = {
            status: false,
        }

        const schema = {
            email: vivo.string().required().email(),
            token: vivo.string().required().max(300)
        }

        vivo.validate(schema, req.params)
        .then(body => next())
        .catch((error) => {
            errorObject.message = 'Invalid data';
            res.json(errorObject);
        })
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
            bio: vivo.string().min(30).max(500)
        }

        vivo.validate(schema, req.body)
        .then((body) => {
            const {sexual_preferences, gender} = req.body;
            let error = false;
            if ((sexual_preferences !== 'Men') && (sexual_preferences !== 'Women') && (sexual_preferences !== 'Other')) {
                errorObject.details = { sexual_preferences: 'Invalid option' };
                error = true;
            }
            if ((gender !== 'Men') && (gender !== 'Women') && (gender !== 'Other')) {
                errorObject.details = { gender: 'Invalid option' };
                error = true;
            }
            if (error === true) {
                res.json(errorObject);
                return;
            } else {
                next();
            }
        })
        .catch((error) => {
            errorObject.details = error.details;
            res.json(errorObject);
        })
    },

    fetchProfiles: (req, res, next) => {
        const filter = req.body.filter;
        errorObject = {
            status: false
        }

        if (filter !== undefined) {
            if (typeof(filter) !== "object"){
                req.body.filter = undefined;
                next();
                return;
            }
            if (filter.age !== undefined){
                if (Array.isArray(filter.age)) {
                    if (isNaN(filter.age[0]) || isNaN(filter.age[1])) {
                        errorObject.message = 'Unvalid age filter values must be a valid numbers';
                        res.json(errorObject);
                        return;
                    }
                } else {
                    errorObject.message = 'Unvalid age filter value';
                    res.json(errorObject);
                    return;
                }
            }
            if (filter.commonTags !== undefined) {
                if (isNaN(filter.commonTags)) {
                    errorObject.message = 'Unvalid common tags filter values must be a valid numbers';
                    res.json(errorObject);
                    return;
                }
            }
            if (filter.tags !== undefined) {
                if (Array.isArray(filter.tags)) {
                    filter.tags.forEach((Element) => {
                        if (!/^[a-z0-9]{2,10}$/.test(Element)) {
                            errorObject.message = 'Unvalid tag filter';
                            res.json(errorObject);
                            return;
                        }
                    });
                } else {
                    errorObject.message = 'Unvalid tags filter value';
                    res.json(errorObject);
                    return;
                }
            }
            if (filter.distance !== undefined) {
                if (isNaN(filter.distance)) {
                    errorObject.message = 'Unvalid distance filter values must be a valid numbers';
                    res.json(errorObject);
                    return;
                }
            }
            if (filter.rating !== undefined){
                if (Array.isArray(filter.rating)) {
                    if (isNaN(filter.rating[0]) || isNaN(filter.rating[0])) {
                        errorObject.message = 'Unvalid rating filter values must be a valid numbers';
                        res.json(errorObject);
                        return;
                    }
                } else {
                    errorObject.message = 'Unvalid age filter value';
                    res.json(errorObject);
                    return;
                }
            }
        }
        next();
    },

    fetchUserProfile: (req, res, next) => {
        const username = req.body.username;
        errorObject = {
            status: false
        }
        const schema = {
            username: vivo.string().alpha().required().min(5).max(20)
        }

        vivo.validate(schema, {username})
        .then(body => next())
        .catch((error) => {
            errorObject.details = error.details;
            res.json(errorObject);
        })
    },

    validUserId: (req, res, next) => {
        const id = req.body.user_id;
        errorObject = {
            status: false
        }

        if (id !== undefined) {
            if(isNaN(id)){
                errorObject.message = 'Invalid user id';
                res.json(errorObject);
                return;
            } else {
                next();
            }
        } else {
            errorObject.message = 'User id is required';
            res.json(errorObject);
            return;
        }
    },

    actions: (req, res, next) => {
        const {user_id} = req.body;
        const errorObject = {
            status: false
        }

        if (user_id === undefined){
            errorObject.message = "you need to enter the user id";
            res.json(errorObject);
            return;
        } else {
            if (isNaN(user_id)) {
                errorObject.message = "please enter a valid user id";
                res.json(errorObject);
                return;
            }
        }
        next();
    },

    privacy: (req, res, next) => {
        const {blocked_id} = req.body;
        const errorObject = {
            status: false
        }

        if (blocked_id === undefined){
            errorObject.message = "you need to enter the user id";
            res.json(errorObject);
            return;
        } else {
            if (isNaN(blocked_id)) {
                errorObject.message = "please enter a valid user id";
                res.json(errorObject);
                return;
            }
        }
        next();
    },

    isFileName: (req, res, next) => {
        const errorObject = {
            status: false,
        }

        const schema = {
            image: vivo.string().required().min(10).max(255)
        }

        vivo.validate(schema, req.body)
            .then(res => next())
            .catch((err) => {
                errorObject.messgae = err.details;
                res.json(errorObject);
            })
    },

    tags: async (req, res, next) => {
        //Tags object needed for vivo validate
        const tags = {
            tag: ""
        }
        //Tag schema
        const schema = {
            tag: vivo.string().pattern(/^[a-z0-9]{2,10}$/, 'Tags can only contain between 2 and 10 alphanumercial characteres').required()
        }

        //This loops over objects in the req.body and validates them using vivo and its schema if a tag is invalid it gets removed from the request body
        await Object.keys(req.body).map( Element => {
            tags.tag = req.body[Element] //Assigning the Element value to tag so we can test it using vivo
            vivo.validate(schema, tags)
                .catch((error) => { //If tag is invalid then we remove it from the req.body
                    delete req.body[Element]
            })
        })
        next()
    }
}