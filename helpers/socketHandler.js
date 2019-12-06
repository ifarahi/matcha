const socketHelpers = require("./socketHelpers");
const chatController = require("../controllers/ChatController");

socketHandler = async ( io, socket ) => {
    console.log( 'a user has beeen connected');
    socket.on( 'join', ( user ) => {
        console.log( user, socket.id )
        socketHelpers.addToConnectedUsers ( user.id, user.username, socket.id );
        io.emit( 'connectedUserChange');
    })
    socket.on( 'disconnect', () => {
        socketHelpers.removeConnectedSocket( socket.id )
        io.emit( 'connectedUserChange');
    });
    socket.on( 'getFriendsList', async ( user ) => {
        io.to( socket.id ).emit( "getFriendsList", await socketHelpers.getFriendsList( user ));
    })
    socket.on( 'sendNewMessage', async ( payload, callback ) => {
        const result = await chatController.insertMessage( payload.senderId, payload.targetId, payload.message );
        if ( result === true ) {
            const targetSocket = socketHelpers.getSocketid( payload.targetId );
            if ( targetSocket )
                io.to( targetSocket ).emit('receiveNewMessage', payload );
            callback ( payload )
        }
    })
}

module.exports = socketHandler;