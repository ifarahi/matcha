const   database   = require('../database/db');

module.exports = {
    
    completeProfile_info: (data) => {
        return new Promise((resolve, reject) => { 
            const   { birthdate, bio, sexual_preferences, id } = data; // using objects destructuring to extract only needed informations from the request body 
            const   sql = 'UPDATE users SET birthdate = ?, bio = ?, sexual_preferences = ?, is_first_visit = 2 WHERE id = ?'; // prepare the statement using positional params '?'
            const   values = [ birthdate, bio, sexual_preferences, id]; // values to be binded the first '?' will be replaced with the first element in the array and so on
            database.query(sql, values, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(true);
            });
        });
    },

    setUserProfilePicture: (data) => {
        return new Promise((resolve, reject) => {
            const   { user_id, image } = data; 
            const   sql = 'UPDATE users SET profile_picture = ? WHERE id = ?';
            const   values = [ image, user_id]; 
            database.query(sql, values, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(true);
            });
        });
    },

    saveUserImage: (data) => {
        return new Promise((resolve, reject) => {
            const { user_id, image } = data;
            const sql = 'INSERT INTO images (user_id, image) VALUES (?, ?)';
            const values = [user_id, image];
            database.query(sql, values, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(true);
            });
        });
    },

    getUserImages: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM images WHERE user_id = ?';
            database.query(sql, id, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    },

    deleteUserImage: (data) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM images WHERE user_id = ? AND image = ?';
            database.query(sql, [data.user_id, data.image], (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(true);
            });
        });
    },

    countUserImages: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT count(*) as images FROM images WHERE user_id = ?';
            database.query(sql, [id], (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result[0]);
            });
        });
    },

    userHasImage: (data) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT count(*) as value FROM images WHERE user_id = ? AND image = ?';
            const values = [data.user_id, data.image];
            database.query(sql, values, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result[0]);
            });
        });
    },

    fetchUserWithId: (id) => {
        return new Promise((resolve, reject) => {
            database.query('SELECT * FROM users WHERE id = ?', id, (error, result) => {
                if (error) reject(error);
                resolve(result[0]);
            });
        });
    },

    completeUserProfile: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE users SET is_first_visit = 3 WHERE id = ?';
            database.query(sql, id, (error, result) => {
                if (error)
                    reject(error);
                else 
                    resolve(true);
            });
        });
    }
}