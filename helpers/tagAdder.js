const tagsModel = require('../models/Tags.js');
const { tagExists, tagGetId, userExists, userHasTag } = require('./tagCheckers') 

userChecker = async ( userId, tagName ) => {
    const result = await userExists( userId );
    if ( result.status === true && result.result !== 0 )
        return ( tagChecker( userId, tagName ) );
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
        return ( await tagAdd( userId, tagName ) );
    else
        return ( result ); 
};

tagAdd = async ( userId, tagName ) => {
    try {
        result = await tagsModel.tagAdd( tagName )
        return ( await userTagsChecker( userId, result.insertId ) )
    } catch ( err ) {
        return ({
            status : false, 
            result : "Couldn't add the tag to tags list"
        })
    }
}

tagIdResolver = async ( userId, tagName ) => {
    const result = await tagGetId( tagName );
    if ( result.status === true )
        return ( await userTagsChecker( userId, result.result ) );
    else 
        return ( result );
}

userTagsChecker = async ( userId, tagId ) => {
    const result = await userHasTag( userId, tagId );
    if ( result.status === true && result.result === 0 )
        return ( await userTagAdd( userId, tagId ) );
    else if ( result.status === true && result.result !== 0 )
        return ({
            status : false,
            result : "Tags can't be duplicated"
        });
    else
        return ( result );
}

userTagAdd = async ( targetId, tagId ) => {
    try {
        await tagsModel.userTagAdd( targetId, tagId );
        return ({
            status : true,
            result : "The tag has been added to your tags list "
        });
    } catch ( err ) {
        return ({
            status : false,
            result : "Couldn't add the tag to your tags list"
        });
    }
}

module.exports.userTagAdd = async ( userId, tagName ) => {
    return new Promise ( async ( resolve, reject ) => {
        const result = await userChecker( userId, tagName );
        resolve( result );
    }) 
}