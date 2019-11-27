const socketHelpers = require("./socketHelpers");

socketHandler = ( io, socket ) => {
    console.log( 'a user has beeen connected');
    socket.on( 'join', ( user ) => {
        socketHelpers.addToConnectedUsers ( user.id, user.username, socket.conn.id );
        io.emit('fetchFiendsList', socketHelpers.getConnectedUsers() );
    })
    socket.on( 'leave', ( user ) => {
        socketHelpers.removeConnectedUser( user.id );
        io.emit( 'fetchFiendsList', socketHelpers.getConnectedUsers() );
    })
    socket.on( 'disconnect', () => {
        socketHelpers.removeConnectedSocket( socket.conn.id )
        io.emit( 'fetchFiendsList', socketHelpers.getConnectedUsers() );
    });
}

module.exports = socketHandler;