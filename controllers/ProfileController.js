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
        try {
            let checker = await tagsModel.userCountTags( id );  
            if ( checker[0].Total <= 1 ) {
                res.send({
                    status : false,
                    result : "You must have one tag at least"
                })
                return;
            }
        } catch ( err ) {
            res.send({
                status : false,
                result : "Couldn't check your tags list"
            })
            return;
        }
        await Promise.all (Object.keys( req.body ).map( async Element => {
            await tagRemover.userTagDelete( id, req.body[Element] )
        }));
        result = await tagsModel.userGetTags( id );
        res.send({
            status : true,
            result
        })
        return;
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

    ompleteProfile_tags_validate: async ( req, res ) => {
        let id = ( Number.isInteger( req.decodedObject.id )) ? req.decodedObject.id : -1;
        let count = await tagsModel.userCountTags( id );  
        if ( count[0].Total < 1 ) {
            res.send({
                status : false,
                result : "Your have one tag atleast to move to the next step"
            })
            return ;
        }
        const userRow = await profileModel.fetchUserWithId(id);
        let step = userRow.is_first_visit;
        if ( step !== 2 ){
            res.send({
                status : false,
                result : "You must fill your bio and sexual preferences before jumping to this step"
            })
            return ;
        } else {
            try {
                await tagsModel.userTagsFinish( id );
                res.send({
                    status : true,
                    result : "Your tags have been saved please move to the next step"
                })
                return ;
            } catch ( err ) {
                res.send({
                    status : false,
                    result : "Something went wrong"
                })
                return ;
            }
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

        try {
            const {is_first_visit} = await profileModel.fetchUserWithId(data.user_id);
            if (is_first_visit !== 0 && is_first_visit !== 3){
                responseObject.status = false;
                responseObject.message = 'You need to insert your personal information and tags before you can upload your pictures';
                res.json(responseObject);
                return;
            }
        } catch (error) {
            responseObject.status = false;
            responseObject.message = error;
            res.json(error);
            return ;
        }
        if (data.image !== undefined) {
            try {
                await profileModel.saveUserImage(data);
                responseObject.message = 'Image has been Uploaded';
                res.json(responseObject);
            } catch (error) {
                responseObject.status = false;
                responseObject.message = error;
                res.json(error);
            }
        }
    },

    getUserImages: async (req, res) => {
        const {id} = req.decodedObject;
        const responseObject = {
            status: true,
            images: null
        }
        try {
            const userExist = await profileModel.fetchUserWithId(id);
            if (userExist === undefined) {
                responseObject.status = false;
                responseObject.error = 'Bad request';
                res.json(responseObject);
            } else {
                const result = await profileModel.getUserImages(id);
                const images = result.map(elem => { return (elem.image); });
                responseObject.images = images;
                res.json(responseObject);
            }
        } catch (error) {
            responseObject.status = false;
            res.error = error;
            res.json(responseObject);
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
                    const {result} = await profileModel.isProfilePicture(data);
                    if (result > 0) {
                        await profileModel.deleteUserImage(data);
                        await profileModel.setUserProfilePicture({user_id: data.user_id, image: 'defaultProfilePicture.png'});
                        fs.unlink(`public/images/${data.image}`, () => {
                            responseObject.message = 'Image has been deleted';
                            res.json(responseObject);
                        });
                    } else {
                        await profileModel.deleteUserImage(data);
                        fs.unlink(`public/images/${data.image}`, () => {
                            responseObject.message = 'Image has been deleted';
                            res.json(responseObject);
                        });
                    }
                    
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
                errorObject.message = 'You have reached the maximum, you cant upload more then 5 pictures';
                res.json(errorObject);
            } else {
                next();
            }
        } catch (error) {
            res.json(error);
        }
    },

    fetchCompleteProfileProgress: async (req, res) => {
        const {id} = req.decodedObject;
        responseObject = {
            status: true,
            progress: null
        }

        try {
            const userRow = await profileModel.fetchUserWithId(id);
            responseObject.progress = userRow.is_first_visit;
            res.json(responseObject);
        } catch (error) {
            responseObject.status = false;
            responseObject.error = error;
            res.json(error);
        }
    },

    completeUserProfile: async (req, res) => {
        const {id} = req.decodedObject;
        const responseObject = {
            status: true,
            message: ''
        }

        try {
            const {images} = await profileModel.countUserImages(id);
            if (images > 0) {
                await profileModel.completeUserProfile(id);
                responseObject.message = "Profile completed";
                res.json(responseObject);
            } else {
                responseObject.status = false;
                responseObject.message = 'Uncompleted Profile';
                res.json(responseObject);
            }
        } catch (error) {
            responseObject.status = false;
            responseObject.message = error;
            res.json(responseObject);
        }
    }
}