const   database   = require('../database/db');

module.exports = {
    fetchProfiles: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age, id, firstname, lastname, username, email, gender, birthdate, profile_picture, longitude, latitude, is_first_visit, sexual_preferences, bio FROM users WHERE id != ?';
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
            const sql = 'SELECT TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age, id, firstname, lastname, username, email, gender, birthdate, profile_picture, longitude, latitude, is_first_visit, sexual_preferences, bio FROM users WHERE id = ? ';
            const values = [id];
            database.query(sql, values, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result[0]);
            });
        });
    }
}