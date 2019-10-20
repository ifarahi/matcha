const tagsModel = require('../models/Tags.js');

module.exports = {
    tagExists : async ( tagName ) => { // Checks if a tag exists in the tags list
        try{
            const result = await tagsModel.tagExists( tagName )
            return({
                status : true,
                result : result
            })
        }catch(err){
            return ({
                status : false,
                result : "Couldn't search for the username in the database."
            })
        }
    },

    getTagId : async ( tagName ) => { // Add a tag to the tags list and returs its id 
        try {
            const check = await module.exports.tagExists( tagName )
            if ( check.status === true  &&  check.result === 0){
                try {
                    result = await tagsModel.tagAdd(tagName)
                    return ({
                        status : true,
                        result : result.insertId  
                    })
                } catch ( err ) {
                    return ({
                        status : true,
                        result : tagId
                    })
                }
            } else if ( check.status === true ) {
                try{
                    const tagId = await tagsModel.getTagId( tagName ) 
                    return ({
                        status : true,
                        result : tagId
                    })
                } catch ( err ){
                    return (err);
                }
            }
        } catch ( err ) {
            return ({
                status : false,
                result : "Couldn't fetch the database"  
            })
        }
    },


    /*
    +++ Check if user id exists as it is a forein key and must exist in the users table
    +++ Get Tag id (insert it if it doesn't exist)
    +++ Check if the user already has that tag
    +++ add that tag to the user tags list if he doesn't have it
    */


    userExists : async (userId) => {
        try {
            const result = await tagsModel.userExists( userId )
            return ({
                status : true,
                result : result
            })
        } catch ( err ) {
            return ({
                status : false,
                result : err
            })
        }
    },
    
    userHasTag : async ( userId, tagId ) => {
        try {
            const result = await tagsModel.userTagExists( userId, tagId )
            return ({
                status : true,
                result : result
            })
        } catch ( err ) {
            return ({
                status : false,
                result : err
            })
        }
    },

    userTagId : async ( userId, tagId ) => {
        try {
            const result = await tagsModel.userGetTagId( userId, tagId )
            return ({
                status : true,
                result : result
            })
        } catch ( err ) {
            return ({
                status : false,
                result : err
            })
        }
    },

    userAddTag : async ( userId, tagName ) => {
        try {
            const userChecker = await module.exports.userExists( userId )
            const tagChecker = await module.exports.getTagId( tagName )

            if ( tagChecker.status === true ){
                const tagId = tagChecker.result
                if ( userChecker.status === true && userChecker.result === 1 ){
                    const userTagsChecker = await module.exports.userHasTag ( userId, tagId )
                    if ( userTagsChecker.status === true && userTagsChecker.result === 0){
                        try {
                            await tagsModel.userTagAdd( userId, tagId )
                            return ({
                                status : true,
                                result : 'Tag has been added'
                            })
                        } catch ( e ) {
                            return ({
                                status : false,
                                result : 'Cannot connect to the database'
                            })
                        }
                    } else if ( userTagsChecker.status === true ) {
                        return ({
                            status : false,
                            result : "Tag already exists in your tags list!"
                        })
                    } else {
                        return ({
                            status : false,
                            result : "Cannot connect to the database"
                        })
                    }
                } else if ( userChecker.status === true ) {
                    return ({
                        status : false,
                        result : "Invalid account id!"
                    })
                } else {
                    return ({
                        status : false,
                        result : "Cannot Connect to the database!"
                    })
                }
            } else {
                return ({
                    status : false,
                    result : 'Cannot connect to the server please try again later'
                })
            }

        } catch ( err ) {
            return ({
                status : false,
                result : err
            })
        }
    },

    userDeleteTag : async ( userId, tagName ) => {
        
        const tagChecker = await module.exports.tagExists( tagName )
        return tagChecker
        if ( tagChecker.status === true && tagChecker.result !== 0 )
        {
                const userChecker = await module.exports.userExists( userId )
                return (userChecker)      
        //         if ( userChecker.status=== true && userChecker.result !== 0 ) {
        //                 let tagId = await module.exports.getTagId( tagName )
        //                 if (tagId.status === true){
        //                     tagId = tagId.result
        //                     const userTagChecker = await module.exports.userHasTag( userId, tagId )
        //                     if ( userTagChecker.status === true  && userTagChecker.result !== 0) {
        //                         let userTagId = await module.exports.userTagId( userId, tagId )
        //                         if ( userTagId.status === true ){
        //                             userTagId = userTagId.result
        //                             console.log(userTagId)
        //                             // try {
        //                             //     tagsModel.userDeleteTag( userTagId )
        //                             //     return ({
        //                             //         status : true,
        //                             //         result : "User tag has been removed successfully"
        //                             //     })
        //                             // } catch (e) {
        //                             //     return ({
        //                             //         status : false,
        //                             //         result : "Couldn't remove tag from your tags list"
        //                             //     })
        //                             // }
        //                         }

        //                     } else {
        //                         return ({
        //                             status : false ,
        //                             result : "Couldn't find this tag in your tags list"
        //                         })
        //                     }
        //                 }
        //                 else {
        //                     return ({
        //                         status : false ,
        //                         result : "Couldn't get the tags id"
        //                     })
        //                 }
        //         } else  {
        //             return ({
        //                 status : false,
        //                 result : "Couldn't search for user" 
        //             })
        //         }
        } else {
            return ({
                status : false,
                result : "Couldn't search tags list"
            })
        }
    }
}