const tagsModel = require('../models/Tags.js');
const profileModel = require('../models/Profile');
const tagAdder = require('../helpers/tagAdder');
const tagRemover = require('../helpers/tagRemover');
const fs = require('fs');

module.exports = {

    completeProfile_info: async (req, res) => { // complete the user profile to be able to use the app 
        const   { birthdate, bio, sexual_preferences } = req.body; // extract data from the request body
        const   userRow = req.decodedObject; // extract the user information from the decodedObject added by the auth middleware
        const   data = { // init the data that will be inserted in the database
            birthdate,
            bio,
            sexual_preferences,
            id: req.decodedObject.id // extract the user id from the decodedObject (the object returned after decoding the auth-token wich contain the user data)
        }
        const responseObject = { // init the response object to be sent back 
            status: true
        }

        // if the user account is not verified cannot complete profile end the request
        if (userRow.is_verified < 1) { // check if the user account is not verified
            responseObject.message = "You need to verify your account to complete your profile";
            res.json(responseObject);
            return;
        }
        try {
            const result = await profileModel.completeProfile_info(data); // insert the user data and set the (its_first_visit = 0) to indicate it no longer the first visit
            if (result === true)
                res.json(responseObject);
        } catch (error) {
            res.send(`something went wrong: ${error}`);
            return;
        }
    },

    completeProfile_tags_add: async (req, res) => {
        if ( Object.keys(req.body).length === 0 )
            res.json({
                status: false,
                message: "Empty request" 
            })
        let id = ( Number.isInteger( req.decodedObject.id )) ? req.decodedObject.id : -1;
        await Promise.all (Object.keys( req.body ).map( async Element => {
            await tagAdder.userTagAdd( id, req.body[Element] )
        }));
        result = await tagsModel.userGetTags( id );
        res.send({
            status : true,
            result
        })
    },

    completeProfile_tags_delete: async (req, res) => {
        if ( Object.keys(req.body).length === 0 )
            res.json({
                status: false,
                message: "Empty request" 
            })
        let id = ( Number.isInteger( req.decodedObject.id )) ? req.decodedObject.id : -1;
        await Promise.all (Object.keys( req.body ).map( async Element => {
            await tagRemover.userTagDelete( id, req.body[Element] )
        }));
        result = await tagsModel.userGetTags( id );
        res.send({
            status : true,
            result
        })
    },

    completeProfile_tags_get: async (req, res) => {
        try {
            let id = ( Number.isInteger( req.decodedObject.id )) ? req.decodedObject.id : -1;
            const result = await tagsModel.userGetTags( id );
            res.send( result );
        } catch ( err ) {
            res.send( [] ) 
        }
    },

    completeProfile_tags_getAll: async ( req, res ) => {
        try {
            const result = await tagsModel.userGetAllTags();
            res.send( result );
        } catch ( err ) {
            res.send( [] ) 
        }
    },

    ompleteProfile_tags_getCount: async ( req, res ) => {
        try {
            let id = ( Number.isInteger( req.decodedObject.id )) ? req.decodedObject.id : -1;
            const result = await tagsModel.userCountTags( id );
            res.send( result );
        } catch ( err ) {
            res.send( 0 ) 
        }
    },

    completeProfile_images: async (req, res) => {
        const data = {
            user_id: req.decodedObject.id,
            image: req.file.filename
        }
        const responseObject = {
            status: true,
            message: ''
        }
        if (data.image !== undefined) {
            try {
                const result = await profileModel.saveUserImage(data);
                responseObject.message = 'Image has been Uploaded';
                res.json(result);
            } catch (error) {
                responseObject.status = false;
                responseObject.message = error;
                res.json(error);
            }
        }
    },

    deleteUserImage: async (req, res) => {
        const data = {
            user_id: req.decodedObject.id,
            image: req.body.image
        }
        const responseObject = {
            status: true,
            message: ''
        }
        try {
            const result = await profileModel.userHasImage(data);
            if (result.value > 0)
            {
                const { images } = await profileModel.countUserImages(data.user_id);
                if (images > 1) {
                    await profileModel.deleteUserImage(data);
                    fs.unlink(`images/${data.image}`, () => {
                        responseObject.message = 'Image has been deleted';
                        res.json(responseObject);
                    });
                } else {
                    responseObject.status = false;
                    responseObject.message = 'You should have at least one image';
                    res.json(responseObject);
                }
            } else {
                responseObject.status = false;
                responseObject.message = 'Invalid image';
                res.json(responseObject);
            } 
        } catch (error) {
            responseObject.status = false;
            responseObject.message = error;
            res.json(responseObject);
        }
    },

    setProfilePicture: async (req, res) => {
        const data = {
            user_id: req.decodedObject.id,
            image: req.body.image
        }
        const responseObject = {
            status: true,
            message: ''
        }
        
        const result = await profileModel.userHasImage(data);
        if (result.value > 0)
        {
            await profileModel.setUserProfilePicture(data);
            responseObject.message = 'Profile picture has been updated';
            res.json(responseObject);
        } else {
            responseObject.status = false;
            responseObject.message = 'Invalid image';
            res.json(responseObject);
        }
    },

    isReachedMaxPictures: async (req, res, next) => {
        const user_id = req.decodedObject.id;
        const errorObject = {
            status: false,
            message: ''
        }
        try {
            const imageCount = await profileModel.countUserImages(user_id);
            if (imageCount.images >= 5)
            {
                errorObject.message = 'you have reached the maximum you cant upload more then 5 picture';
                res.json(errorObject);
            } else {
                next();
            }
        } catch (error) {
            res.json(error);
        }
    }
}