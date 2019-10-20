const tagsModel = require('../models/Tags.js');
const { tagExists, tagGetId, userExists, userHasTag, userTagId } = require('./tagCheckers') 

userChecker = async ( userId, tagName ) => {
    const result = await userExists( userId );
    if ( result.status === true && result.result !== 0 )
        return ( await tagChecker( userId, tagName ) );
    else if ( result.status === true && result.result === 0 )
        return ({
            status : false,
            result : "The user id is invalid" 
        });
    else
        return ( result ); 
};

tagChecker = async ( userId, tagName ) => {
    const result = await tagExists( tagName ); 
    if ( result.status === true && result.result !== 0 )
        return ( await tagIdResolver( userId, tagName ) );
    else if ( result.status === true && result.result === 0 )
        return ({
            status : false,
            result : "The tag doesn't exist" 
        });
    else
        return ( result ); 
};

tagIdResolver = async ( userId, tagName ) => {
    const result = await tagGetId( tagName );
    if ( result.status === true )
        return ( await userTagsChecker( userId, result.result ) );
    else 
        return ( result );
}

userTagsChecker = async ( userId, tagId ) => {
    const result = await userHasTag( userId, tagId );
    if ( result.status === true && result.result !== 0 )
        return ( await targetIdResolver( userId, tagId ) );
    else if ( result.status === true && result.result === 0 )
        return ({
            status : false,
            result : "The specified tag doesn't exist in your tags list"
        });
    else
        return ( result );
}

targetIdResolver = async ( userId, tagId ) => {
    const result = await userTagId( userId, tagId )
    if ( result.status === true )
        return (  await targetRemover( result.result ) );
    else 
        return ( result );
}

targetRemover = async ( targetId ) => {
    try {
        await tagsModel.userDeleteTag( targetId );
        return ({
            status : true,
            result : "The tag has been successfully removed"
        });
    } catch ( err ) {
        return ({
            status : false,
            result : "Couldn't remove the tag from your tags list"
        });
    }
}

module.exports = {
    userTagDelete : async( userId, tagName ) => {
        return( await userChecker( userId, tagName ));
    }
}