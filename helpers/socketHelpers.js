let connectedUsers = [];

const addToConnectedUsers = ( user, socket_id ) => {
    let existingUser = findConnectedUser( user );
    if ( existingUser === null )
        if ( user.length >= 3 && socket_id.length >= 3 )
            connectedUsers.push( { user, socket_id } );
    console.log(connectedUsers);
}

const findConnectedUser = ( user ) => {
    for( i = 0; i < connectedUsers.length; i++ )
        if ( connectedUsers[ i ].user === user )
            return connectedUsers[ i ];
    return null;
}

const removeConnectedUser = ( user ) => {
    connectedUsers = connectedUsers.filter( e => {
        console.log( e );
        return ( e.user !== user );
    })
}

module.exports = {
    addToConnectedUsers,
    findConnectedUser,
    removeConnectedUser
}