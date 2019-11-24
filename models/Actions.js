const database = require('../database/db');

module.exports = {
    isMatch: (data) => {
        return new Promise((resolve, reject) => {
            const {ConnectedUser, RequestedUser} = data;
            const sql = 'SELECT count(*) AS isMatch FROM matches WHERE (user_one = ? && user_two = ?) OR (user_one = ? && user_two = ?)';
            const values = [ConnectedUser,RequestedUser,RequestedUser,ConnectedUser];
            database.query(sql,values,(error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(result[0]);
            });
        }); 
    },

    unMatchUsers: (data) => {
        return new Promise((resolve, reject) => {
            const {ConnectedUser, RequestedUser} = data;
            const sql = 'DELETE FROM matches WHERE (user_one = ? && user_two = ?) OR (user_one = ? && user_two = ?)';
            const values = [ConnectedUser,RequestedUser,RequestedUser,ConnectedUser];
            database.query(sql,values,(error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(true);
            });
        })
    },

    unLikeUser: (data) => {
        return new Promise((resolve, reject) => {
            const {ConnectedUser, RequestedUser} = data;
            const sql = 'DELETE FROM likes WHERE user_liked = ? AND user_likes = ?';
            const values = [ConnectedUser,RequestedUser];
            database.query(sql,values,(error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(true);
            });
        })
    }
}