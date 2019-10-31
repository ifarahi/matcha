const tagsModel = require('../models/Tags.js');
const { tagExists, tagGetId, userExists, userHasTag, userTagId } = require('./tagCheckers') 

rUserChecker = async ( userId, tagName ) => {
    const result = await userExists( userId );
    if ( result.status === true && result.result !== 0 )
        return ( await rTagChecker( userId, tagName ) );
    else if ( result.status === true && result.result === 0 )
        return ({
            status : false,
            result : "The user id is invalid" 
        });
    else
        return ( result ); 
};

rTagChecker = async ( userId, tagName ) => {
    const result = await tagExists( tagName ); 
    if ( result.status === true && result.result !== 0 )
        return ( await rTagIdResolver( userId, tagName ) );
    else if ( result.status === true && result.result === 0 )
        return ({
            status : false,
            result : "The tag doesn't exist" 
        });
    else
        return ( result ); 
};

rTagIdResolver = async ( userId, tagName ) => {
    const result = await tagGetId( tagName );
    if ( result.status === true )
        return ( await rUserTagsChecker( userId, result.result ) );
    else 
        return ( result );
}

rUserTagsChecker = async ( userId, tagId ) => {
    const result = await userHasTag( userId, tagId );
    if ( result.status === true && result.result !== 0 )
        return ( await rTargetIdResolver( userId, tagId ) );
    else if ( result.status === true && result.result === 0 )
        return ({
            status : false,
            result : "The specified tag doesn't exist in your tags list"
        });
    else
        return ( result );
}

rTargetIdResolver = async ( userId, tagId ) => {
    const result = await userTagId( userId, tagId )
    if ( result.status === true )
        return (  await rTargetRemover( result.result ) );
    else 
        return ( result );
}

rTargetRemover = async ( targetId ) => {
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
        return new Promise ( async ( resolve, reject ) => {
            const result = await rUserChecker( userId, tagName );
            resolve( result );
        }) 
    }
}