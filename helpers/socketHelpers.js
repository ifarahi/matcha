const { getUserMatches } =  require('../controllers/BrowseController');

let connectedUsers = [];

const addToConnectedUsers = ( userId, username, socketId ) => {
    let existingUser = findConnectedUser( userId );
    if ( existingUser === -1 )
        if ( username.length >= 3 && socketId.length >= 3 )
            connectedUsers.push( { userId, username, socketId } );
    else 
        if ( username.length >= 3 && socketId.length >= 3 )
            connectedUsers[ existingUser ].socketId = socketId;
}

const findConnectedUser = ( userId ) => {
    for( i = 0; i < connectedUsers.length; i++ )
        if ( connectedUsers[ i ].userId === userId )
            return i;
    return -1;
}

const getConnectedUsers = () => {
    return connectedUsers;
}

const removeConnectedUser = ( userId ) => {
    connectedUsers = connectedUsers.filter( e => {
        return ( e.userId !== userId );
    })
}

const removeConnectedSocket = ( socketId ) => {
    connectedUsers = connectedUsers.filter( e => {
        return ( e.socketId !== socketId );
    })
}

const getFriendsList = async( id ) => {
    let matchList = []; 
    matchList = await getUserMatches( id );
    const keys = Object.keys( matchList.matches );
    const friendsList = keys.map( key => {
        let friend = matchList.matches[ key ];
        friend.isOnline = isUserConnected( friend.id );
        return friend;
    })

    return friendsList;
}

const isUserConnected = ( userId ) => {
    for ( let i = 0  ; i < connectedUsers.length; i++ ) {
        if ( connectedUsers[ i ].userId === userId )
            return true;
    }
    return false;
}

const getSocketid = ( userId ) => {
    for ( let i = 0 ; i < connectedUsers.length ; i++ ) {
        if ( userId === connectedUsers[ i ].userId )
            return connectedUsers[ i ].socketId;
    }
    return null;
} 

const getConnectedUserId = ( socketId ) => {
    for ( let i = 0 ; i < connectedUsers.length ; i++ ) {
        if ( socketId === connectedUsers[ i ].socketId )
            return connectedUsers[ i ].userId;
    }
    return null;
} 

module.exports = {
    addToConnectedUsers,
    findConnectedUser,
    removeConnectedUser,
    removeConnectedSocket,
    getSocketid,
    getFriendsList,
    getConnectedUserId,
    getConnectedUsers
}