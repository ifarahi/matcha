const   database   = require('../database/db');

module.exports = {
    fetchProfiles: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT f_fameRating(users.id) AS rating, TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age, id, firstname, lastname, username, email, gender, birthdate, profile_picture, longitude, latitude, is_first_visit, sexual_preferences, bio FROM users WHERE id != ?';
            const values = [id];
            database.query(sql, values, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    },

    fetchUserProfile: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT f_fameRating(users.id) AS rating, TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age, id, firstname, lastname, username, email, gender, birthdate, profile_picture, longitude, latitude, is_first_visit, sexual_preferences, bio FROM users WHERE id = ? ';
            const values = [id];
            database.query(sql, values, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result[0]);
            });
        });
    },

    fetchMatchedProfiles: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM matches WHERE user_one = ? OR user_two = ?';
            database.query(sql, [id, id], (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result[0]);
            });
        });
    },

    fetchProfileWithUsername: (username) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT f_fameRating(users.id) AS rating, TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age, id, firstname, lastname, username, email, gender, birthdate, profile_picture, longitude, latitude, is_first_visit, sexual_preferences, bio FROM users WHERE username = ? ';
            const values = [username];
            database.query(sql, values, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result[0]);
            });
        });
    },

    fetchProfileLikes: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM likes WHERE user_liked = ?';
            database.query(sql, id, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    }

}