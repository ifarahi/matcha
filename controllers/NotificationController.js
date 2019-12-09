const notificationModel = require('../models/Notification');


module.exports = {
    notificationAddNew : async( user1, user2, type ) => {
        try {
            if ( user1 !== user2 ) {
                const res1 = await notificationModel.userExists( user1 );
                if ( res1 > 0 ) {
                    const res2 = await notificationModel.userExists( user2 );
                    if ( res2 > 0 ) {
                        if ( type ) {
                            if ( type === "Chat" || type === "Visit" || type === "Like" || type === "Match" || type === "UnLike" || type === "UnMatch" ) {
                                return ( await notificationModel.notificationCreate( user1, user2, type ) );
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
    }

}