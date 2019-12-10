const notificationModel = require('../models/Notification');


module.exports = {
    notificationAddNew : async( user1, user2, type, io, socketHelpers ) => {
        try {
            if ( user1 !== user2 ) {
                const res1 = await notificationModel.userExists( user1 );
                if ( res1 > 0 ) {                  
                    const res2 = await notificationModel.userExists( user2 );
                    if ( res2 > 0 ) {
                        if ( type ) {
                            if ( type === "Chat" || type === "Visit" || type === "Like" || type === "Match" || type === "UnLike" || type === "UnMatch" ) {
                                await notificationModel.notificationCreate( user1, user2, type );
                                const socketId = socketHelpers.getSocketid( parseInt(user2) );
                                if ( socketId )
                                    io.to( socketId ).emit('newNotification', type);
                            } else return ("Invalid notification type");
                        } else return ("Notification type was not provided");
                    } else return ("Receiver is invalid"); 
                } else return ("Requester is invalid")
            } else return ("You can't send a notification to yourself");
        } catch ( e ) {
            return 'Something went wrong';
        }
    }, 

    notificationDeleteAll : async( user ) => {
        try {
            const res = await notificationModel.userExists( user );
            if ( res > 0 ) {
                return ( await notificationModel.notificationDeleteAll( user ) );
            } else return ("Invalid user id")
        } catch ( e ) {
            return 'Something went wrong';
        }
    },

    notificationSetSeen : async( user ) => {
        try {
            const res = await notificationModel.userExists( user );
            if ( res > 0 ) {
                return ( await notificationModel.notificationSetSeen( user ) );
            } else return ("Invalid user id")
        } catch ( e ) {
            return 'Something went wrong';
        }
    },

    notificationGetAll : async( user ) => {
        try {
            const res = await notificationModel.userExists( user );
            if ( res > 0 ) {
                return ( await notificationModel.notificationGetAll( user ) );
            } else return ("Invalid user id")
        } catch ( e ) {
            return 'Something went wrong';
        }
    },

    notificationGetNewCount : async( user ) => {
        try {
            const res = await notificationModel.userExists( user );
            if ( res > 0 ) {
                return ( await notificationModel.notificationCountNew( user ) );
            } else return ("Invalid user id")
        } catch ( e ) {
            return 'Something went wrong';
        }
    },

    getUnreadMessages : async( user ) => {
        try {
            const res = await notificationModel.userExists( user );
            if ( res > 0 ) {
                return ( await notificationModel.messagesCountNew( user ) );
            } else return ("Invalid user id")
        } catch ( e ) {
            return 'Something went wrong';
        }
    },

    getNotifications: async (req, res) => {
        const {id} = req.decodedObject;
        const responseObject = {
            status: true
        }
        try {
            responseObject.notifications = await module.exports.notificationGetNewCount( id );
            res.status( 200 ).json( responseObject );
        } catch ( error ) {
            responseObject.status = false;
            responseObject.message = `something went wrong`;
            res.status( 400 ).json( responseObject );
        }
    },

    getNewMessagesCount: async (req, res) => {
        const {id} = req.decodedObject;
        const responseObject = {
            status: true
        }
        try {
            responseObject.notifications = await module.exports.getUnreadMessages( id );
            res.status( 200 ).json( responseObject );
        } catch ( error ) {
            responseObject.status = false;
            responseObject.message = `something went wrong`;
            res.status( 400 ).json( responseObject );
        }
    }

}