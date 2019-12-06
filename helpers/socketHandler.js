const socketHelpers = require("./socketHelpers");
const chatController = require("../controllers/ChatController");
const authentication = require('../helpers/authentication');
const actionModel = require('../models/Actions');

socketHandler = async ( io, socket ) => {
    console.log( 'a user has beeen connected');
    socket.on( 'join', async ( user ) => {
        const { authToken } = user;
        const resp = await authentication.verify( authToken );
        try {
            if (resp.status === true) {
                socketHelpers.addToConnectedUsers( resp.userId, user.username, socket.id );
            }
            io.emit('connectedUserChange');
        } catch (error) {

        }

    })
    socket.on( 'disconnect', () => {
        socketHelpers.removeConnectedSocket( socket.id )
        io.emit( 'connectedUserChange');
    });
    socket.on( 'getFriendsList', async ( user ) => {
        const { authToken } = user;
        const resp = await authentication.verify( authToken );
        try {
            if (resp.status === true)
                io.to( socket.id ).emit( "getFriendsList", await socketHelpers.getFriendsList( resp.userId ));
        } catch ( e ) {

        }
    })
    socket.on( 'sendNewMessage', async ( payload, callback ) => {
        const responseObject = {
            status: true,
        }
        try {
            const { authToken, targetId, message } = payload;
            const resp = await authentication.verify( authToken );
            if ( resp.status === true ) {
                const senderId = resp.userId;
                if ( senderId !== targetId ) {
                    const data = {
                        ConnectedUser: senderId,
                        RequestedUser: targetId
                    }
                    const {isMatch} = await actionModel.isMatch(data);
                    if (isMatch > 0) {
                        const result = await chatController.insertMessage( senderId, targetId, message );
                        if ( result === true ) {
                            const targetSocket = socketHelpers.getSocketid( targetId );
                            responseObject.payload = payload;
                            if ( targetSocket ){
                                io.to( targetSocket ).emit('receiveNewMessage',  payload);
                            }
                            callback ( responseObject )
                        }
                    }
                }
            }

        } catch (error) {
            responseObject.message = `something went wrong : ${error}`;
            responseObject.status = false;
            callback ( responseObject );
        }
    })
}

module.exports = socketHandler;