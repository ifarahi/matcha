const   database   = require('../database/db');

/*
*** The user model responsible to deal with the database (CRUD)
*** take data only from the userController and send back fetched data
*/

module.exports = {
    usernameExists : (username) => { // check if the username is already exists
        return new Promise((resolve, reject) => { 

            database.query('SELECT count(*) as rows FROM users WHERE username = ?', username, (error, result) => {
                if (error) reject(error);
                resolve(result[0].rows);
            });
        });
    },

    emailExists : (email) => { // check if the email is already exists
        return new Promise((resolve, reject) => { 

            database.query('SELECT count(*) as rows FROM users WHERE email = ?', email, (error, result) => {
                if (error) reject(error);
                resolve(result[0].rows);
            });
        });
    },

    register: (data) => {
        return new Promise((resolve, reject) => { 
            const   { firstname, lastname, username, gender, email, password, verify_email_hash } = data; // using objects destructuring to extract only needed informations from the request body 
            const   sql = 'INSERT INTO users (firstname, lastname, username, gender, email, password, verify_email_hash) VALUES (?, ?, ?, ?, ?, ?, ?)'; // prepare the statement using positional params '?'
            const   values = [ firstname, lastname, username, gender, email, password, verify_email_hash]; // values to be binded the first '?' will be replaced with the first element in the array and so on
            database.query(sql, values, (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        });
    }
}