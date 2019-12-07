const socketHelpers = require("./socketHelpers");
const authentication = require('../helpers/authentication');
const actionModel = require('../models/Actions');
const chatController = require("../controllers/ChatController");
const userController= require('../controllers/UsersController');
const _ = require('lodash');

socketHandler = async ( io, socket ) => {

    socket.on( 'join', async ( user ) => {
        const { authToken } = user;
        const resp = await authentication.verify( authToken );
        try {
            if (resp.status === true) {
                await socketHelpers.addToConnectedUsers( resp.userId, user.username, socket.id );
            }
            io.emit('connectedUserChange');
        } catch (error) {

        }

    })

    socket.on( 'disconnect', async() => {
        /*
        * Check if the user exists in the list of connected users  √
        * GET the user id using the socket id √
        * Check if the userId exists in the db √
        * update last logged_in field on the db to the CURRENT_TIMESTAP √
        */

        const userId = socketHelpers.getConnectedUserId( socket.id );
        if ( userId )
            await userController.updateLastLogged( userId );

        socketHelpers.removeConnectedSocket( socket.id )
        io.emit( 'connectedUserChange');
    });


    socket.on( 'getFriendsList', async ( user ) => {
        const { authToken } = user;
        const resp = await authentication.verify( authToken );
        try {
            if (resp.status === true)
                socket.emit( "getFriendsList", await socketHelpers.getFriendsList( resp.userId ));
        } catch ( e ) {

        }
    })

    socket.on( 'getOnlineList', async ( user ) => {
        const { authToken } = user;
        const resp = await authentication.verify( authToken );
        try {
            if (resp.status === true) {
                let connectUsers = await socketHelpers.getConnectedUsers();
                const result = connectUsers.map( Element => { 
                    return Element.userId;
                })
                socket.emit( "getOnlineList", result);
            }
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