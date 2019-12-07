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
                    resolve(result);
            });
        });
    },

    fetchProfileWithUsername: (username) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT f_fameRating(users.id) AS rating, TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age, id, firstname, lastname, username, email, gender, birthdate, profile_picture, longitude, latitude, is_first_visit, sexual_preferences, bio, last_logged FROM users WHERE username = ? ';
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
    },

    isLike: (data) => {
        return new Promise((resolve, reject) => {
            const {id, user_id} = data;
            const sql = 'SELECT count(*) AS isLike FROM likes WHERE user_liked = ? AND user_likes = ?';
            const values = [id, user_id];
            database.query(sql, values, (error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(result[0]);
            });
        });
    },

    getMatchedProfiles: (id) => {
        return new Promise((resolve, reject) => {
            const fields = "users.`id`, users.`firstname`, users.`lastname`, users.`username`, users.`gender`, users.`email`, users.`profile_picture`, users.`longitude`, users.`latitude`, users.`is_verified`, users.`is_first_visit`, users.`bio`, users.`sexual_preferences`";
            const sql = `SELECT ${fields} FROM matches JOIN users ON (user_one = ? AND user_two = users.id) OR (user_two = ? AND user_one = users.id)`;
            database.query(sql, [ id, id ], (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    },

    getProfilesLikes: (id) => {
        return new Promise((resolve, reject) => {
            const fields = "users.`id`, users.`firstname`, users.`lastname`, users.`username`, users.`gender`, users.`email`, users.`profile_picture`, users.`longitude`, users.`latitude`, users.`is_verified`, users.`is_first_visit`, users.`bio`, users.`sexual_preferences`";
            const sql = `SELECT ${fields} FROM likes JOIN users ON (user_liked = ? AND user_likes = users.id)`;
            database.query(sql, id, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    },

    getProfilesLiked: (id) => {
        return new Promise((resolve, reject) => {
            const fields = "users.`id`, users.`firstname`, users.`lastname`, users.`username`, users.`gender`, users.`email`, users.`profile_picture`, users.`longitude`, users.`latitude`, users.`is_verified`, users.`is_first_visit`, users.`bio`, users.`sexual_preferences`";
            const sql = `SELECT ${fields} FROM likes JOIN users ON (user_likes = ? AND user_liked = users.id)`;
            database.query(sql, id, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    },

    fetchTags: () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT name FROM tags';
            database.query(sql,null, (error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(result);
            });
        })
    }
}