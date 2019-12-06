const   database   = require('../database/db');


module.exports = {

    //Main Chat

    userExists : ( id ) => { // checks if the tagname is already exists
        return new Promise( ( resolve, reject ) => { 
            database.query('SELECT count(*) as rows FROM users WHERE id = ?', id, (error, result) => {
                if (error) reject(error);
                else resolve(result[0].rows);
            });
        });
    },

    chatExists : ( user1, user2 ) => { // checking if a chat between two given users exists
        return new Promise( ( resolve, reject ) => {
            database.query('SELECT count(*) as rows FROM chat WHERE ( user1 = ? AND user2 = ? ) OR ( user1 = ? AND user2 = ? )',
            [ user1, user2, user2, user1 ], ( error, result ) => {
                if ( error ) reject( error );
                else resolve( result[0].rows );
            });
        });
    },

    chatCreate : ( user1, user2 ) => { // Creates a chat for two given users
        return new Promise( ( resolve, reject ) => {
            database.query('INSERT INTO chat ( user1, user2 ) VALUES ( ?, ? )', [ user1, user2 ],
            ( error, result ) => {
                if ( error ) reject( error );
                else resolve(result.insertId);
            });
        });
    },

    chatDelete : ( user1, user2 ) => { // Removes a chat of two given users
        return new Promise( ( resolve, reject ) => {
            database.query('DELETE FROM chat WHERE ( user1 = ? AND user2 = ? ) OR ( user1 = ? AND user2 = ? )',
            [ user1, user2, user2, user1 ],
            ( error, result ) => {
                if ( error ) reject ( error );
                else resolve( result );
            });
        });
    },

    chatGetId : ( user1, user2 ) => { // Gets the id of a chat between two given users
        return new Promise( ( resolve, reject ) => {
            database.query('SELECT id FROM chat WHERE ( user1 = ? AND user2 = ? ) OR ( user1 = ? AND user2 = ? )',
            [ user1, user2, user2, user1 ], ( error, result ) => {
                try {
                    if ( error ) reject( error );
                    else resolve( result[0].id );
                } catch ( e ) {
                    reject("Chat doesn't exist");
                } 
            });
        });
    },

    //Conversations

    messageInsert ( chatId, targetId, senderId, message ) {
        return new Promise ( ( resolve, reject ) => {
            database.query("Insert into messages ( chat_id, targetId, senderId, message ) VALUES ( ?, ?, ?, ?)",
            [ chatId, targetId, senderId, message ],
            ( error, result ) => {
                try{
                    if ( error ) reject( error );
                    else resolve( result.insertId );
                } catch ( e ) {
                    reject("Couldn't save the message invalid data provided");
                }
            });
        });
    },

    messageGetAll ( chatId ) {
        return new Promise( ( resolve, reject ) => {
            database.query('SELECT * FROM messages WHERE chat_id = ?', chatId,
            ( error, result ) => {
                try{
                    if ( error ) reject( error );
                    else resolve( result );
                } catch ( e ) {
                    reject("Couldn't read the chat messages");
                }
            })
        })
    }




}