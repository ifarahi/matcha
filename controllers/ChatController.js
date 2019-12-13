const chatModel = require('../models/Chat');

//Functions responsible of saving messages and chats

const userExists = async ( senderId, targetId, message ) => {
    try {
        const result = await chatModel.userExists( targetId );
        if ( result !== 0 )
            return ( await getChatId( senderId, targetId, message ) )
        else 
            return "Couldn't start the chat";
    }
    catch ( e ) {
        return "Couldn't connect to the database try again later.";
    }
}

const getChatId = async ( senderId, targetId, message ) => {
    try{
        const result = await chatModel.chatExists( targetId, senderId );
        if ( result !== 0 ) {
            const id = await chatModel.chatGetId( targetId, senderId );
            if ( id )
                return await sendMessage( id, targetId, senderId, message );
            else return "Oops something went wrong.";
        } else {
            const chatId = await chatModel.chatCreate( targetId, senderId );
            if ( chatId )
                return await sendMessage( chatId, targetId, senderId, message );
            else return "Oops something went wromg!";
        } 
    } catch ( e ) {
        return "Couldn't connect to the database try again later!";
    }
}

const sendMessage = async( chatId, targetId, senderId, message ) => {
    try {
        await chatModel.messageInsert( chatId, targetId, senderId, message );
        return true;
    } catch ( e ) {
        return "Couldn't save your message";
    }
}

//functions that responsible of loadind saved messages

const checkUser = async ( user1, user2 ) => {
    try {
        const result = await chatModel.userExists( user2 );
        if ( result !== 0 )
            return ( await findChat( user1, user2 ) );
        else 
            return {
                status: false ,
                result: "invalid User"
            };
    }
    catch ( e ) {
        return {
            status: false ,
            result: "Invalid data provided"
        };
    }
}

const findChat = async ( user1, user2 ) => {
    try{
        const result = await chatModel.chatExists( user1, user2 );
        if ( result !== 0 ) {
            const id = await chatModel.chatGetId( user1, user2 );
            if ( id )
                return { 
                    status: true,
                    result: await chatModel.messageGetAll( id )
                };
            else 
            return {
                status: false ,
                result: "Oops something went wrong."
            };
        }  else {
            return {
                status: false ,
                result: "Chat not found"
            };
        }
    } catch ( e ) {
        return {
            status: false ,
            result: "Couldn't save message"
        };
    }
}



const insertMessage = async ( senderId, targetId, message ) => {

    /*
    **  Must check the access token before doing anything here
    **  Must extract the user id from the access tokem then compare it to the one provided
    */

    try {
        if ( senderId === targetId )
            return "You can't send a message to yourself";
        if ( message && targetId && senderId ) {
            if ( message.length >= 1 && message.length <= 500 )
                return ( await userExists( senderId, targetId, message ))
            else
                return {
                    status: false ,
                    result: "The message should contain between 1 and 500 chars"
                };
        }
    } catch ( e ) {
        return {
            status: false ,
            result: "Couldn't save message"
        };
    }
}

const loadMessages = async ( req , res ) => {
    try {
        const { user1, user2 } = req.body;
        res.send (await checkUser( user1, user2 ));
    } catch ( e ) {
        res.send("Something went wrong please try gain later");
    }
}

module.exports = {
    insertMessage,
    loadMessages
}