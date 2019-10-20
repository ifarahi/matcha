const tagsModel = require('../models/Tags.js');

module.exports = {
    tagExists : async ( tagName ) => {
        try {
            const result = await tagsModel.tagExists( tagName );
            return({
                status : true,
                result : result
            });
        } catch ( err ) {
            return ({
                status : false,
                result : "Couldn't search for the tag."
            });
        }
    },
    
    tagGetId : async ( tagName ) => { 
        try {
            result = await tagsModel.getTagId( tagName );
            return ({
                status : true,
                result : result
            });
        } catch ( err ) {
            return ({
                status : false,
                result : "Couldn't search for tag id"
            });
        }
    },
    
    userExists : async (userId) => {
        try {
            const result = await tagsModel.userExists( userId );
            return ({
                status : true,
                result : result
            });
        } catch ( err ) {
            return ({
                status : false,
                result : err
            });
        }
    },
    
    userHasTag : async ( userId, tagId ) => {
        try {
            const result = await tagsModel.userTagExists( userId, tagId );
            return ({
                status : true,
                result : result
            });
        } catch ( err ) {
            return ({
                status : false,
                result : err
            });
        }
    },
    
    userTagId : async ( userId, tagId ) => {
        try {
            const result = await tagsModel.userGetTagId( userId, tagId );
            return ({
                status : true,
                result : result
            });
        } catch ( err ) {
            return ({
                status : false,
                result : err
            });
        }
    }
}
