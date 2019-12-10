const   database   = require('../database/db');


module.exports = {

    userExists : ( id ) => { // checks if the tagname is already exists
        return new Promise( ( resolve, reject ) => { 
            database.query('SELECT count(*) as rows FROM users WHERE id = ?', id, (error, result) => {
                if (error) reject(error);
                else resolve(result[0].rows);
            });
        });
    },

    notificationCreate : ( user1, user2, type ) => { // Creates a chat for two given users
        return new Promise( ( resolve, reject ) => {
            database.query('INSERT INTO notification ( user_id, target_id, type ) VALUES ( ?, ?, ? )', [ user1, user2, type ],
            ( error, result ) => {
                if ( error ) reject( error );
                else resolve(result.insertId);
            });
        });
    },

    notificationDelete : ( user, notificationId ) => { // Removes a chat of two given users
        return new Promise( ( resolve, reject ) => {
            database.query('DELETE FROM notification WHERE ( id = ? AND target_id = ? )',
            [ notificationId, user ],
            ( error, result ) => {
                if ( error ) reject ( error );
                else resolve( result );
            });
        });
    },

    notificationDeleteAll : ( user ) => { // Removes a chat of two given users
        return new Promise( ( resolve, reject ) => {
            database.query('DELETE FROM notification WHERE target_id = ?', user,
            ( error, result ) => {
                if ( error ) reject ( error );
                else resolve( result );
            });
        });
    },


    notificationGetAll : ( user ) => {
        return new Promise( ( resolve, reject ) => {
            database.query('SELECT * FROM notification WHERE target_id = ?', user,
            ( error , result ) => {
                if ( error ) reject ( error );
                else resolve( result );
            });
        });
    },

    notificationCountNew : ( user ) => {
        return new Promise( ( resolve, reject ) => {
            database.query('SELECT COUNT(*) AS COUNT FROM notification WHERE (target_id = ? AND seen = 0) AND type != "Chat"', user,
            ( error, result ) => {
                if ( error ) reject ( error );
                else resolve( result[0].COUNT );
            });
        });
    },

    messagesCountNew : ( user ) => {
        return new Promise( ( resolve, reject ) => {
            database.query('SELECT COUNT(*) AS COUNT FROM notification WHERE target_id = ? AND seen = 0 AND type = "Chat"', user,
            ( error, result ) => {
                if ( error ) reject ( error );
                else resolve( result[0].COUNT );
            });
        });
    },

    notificationSetSeen : ( user ) => {
        return new Promise( ( resolve, reject ) => {
            database.query('UPDATE notification SET seen = 1 WHERE target_id = ? AND type != "Chat"', user,
            ( error, result ) => {
                if ( error ) reject ( error );
                else resolve( result );
            });
        });
    },

    mesagesSetSeen : ( user ) => {
        return new Promise( ( resolve, reject ) => {
            database.query('UPDATE notification SET seen = 1 WHERE target_id = ? AND type = "Chat"', user,
            ( error, result ) => {
                if ( error ) reject ( error );
                else resolve( result );
            });
        });
    }
}