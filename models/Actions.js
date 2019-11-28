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

    matchUsers: (data) => {
        return new Promise((resolve, reject) => {
            const {ConnectedUser, RequestedUser} = data;
            const sql = 'INSERT INTO matches (user_one, user_two) VALUES (?,?)';
            const values = [ConnectedUser,RequestedUser];
            database.query(sql, values, (error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(true);
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

    isLike: (data) => {
        return new Promise((resolve, reject) => {
            const {ConnectedUser, RequestedUser} = data;
            const sql = 'SELECT count(*) AS isLike FROM likes WHERE user_liked = ? AND user_likes = ?';
            const values = [ConnectedUser,RequestedUser];
            database.query(sql, values, (error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(result[0]);
            });
        });
    },

    isLiker: (data) => {
        return new Promise((resolve, reject) => {
            const {ConnectedUser, RequestedUser} = data;
            const sql = 'SELECT * FROM likes WHERE user_liked = ? AND user_likes = ?';
            const values = [RequestedUser, ConnectedUser];
            database.query(sql, values, (error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(result[0]);
            });
        });
    },

    likeUser: (data) => {
        return new Promise((resolve, reject) => {
            const {ConnectedUser, RequestedUser} = data;
            const sql = 'INSERT INTO likes (user_liked, user_likes) VALUES (?,?)';
            const values = [ConnectedUser,RequestedUser];
            database.query(sql, values, (error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(true);
            });
        });
    },

    deleteLikeHistory: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM likes WHERE id = ?';
            database.query(sql, id, (error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(true);
            });
        });
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
    },

    setAsVisited: (data) => {
        return new Promise((resolve, reject) => {
            const {visitor, visited} = data;
            const sql  = 'INSERT INTO visits (visitor, visited) VALUES (?, ?)';
            const values = [visitor, visited];
            database.query(sql, values, (error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(result);
            });
        });
    }
}