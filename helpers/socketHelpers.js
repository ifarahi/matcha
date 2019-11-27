let connectedUsers = [];

const addToConnectedUsers = ( userId, username, socketId ) => {
    let existingUser = findConnectedUser( userId );
    if ( existingUser === null )
        if ( username.length >= 3 && socketId.length >= 3 )
            connectedUsers.push( { userId, username, socketId } );
    console.log(connectedUsers);
}

const findConnectedUser = ( userId ) => {
    for( i = 0; i < connectedUsers.length; i++ )
        if ( connectedUsers[ i ].userId === userId )
            return connectedUsers[ i ];
    return null;
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

const getConnectedUsers = () => {
    return connectedUsers;
}

module.exports = {
    addToConnectedUsers,
    findConnectedUser,
    removeConnectedUser,
    removeConnectedSocket,
    getConnectedUsers
}