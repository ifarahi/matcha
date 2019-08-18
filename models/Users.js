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

    register: (data) => { // regitser a new user
        return new Promise((resolve, reject) => { 
            const   { firstname, lastname, username, gender, email, password, verify_email_hash } = data; // using objects destructuring to extract only needed informations from the request body 
            const   sql = 'INSERT INTO users (firstname, lastname, username, gender, email, password, verify_email_hash) VALUES (?, ?, ?, ?, ?, ?, ?)'; // prepare the statement using positional params '?'
            const   values = [ firstname, lastname, username, gender, email, password, verify_email_hash]; // values to be binded the first '?' will be replaced with the first element in the array and so on
            database.query(sql, values, (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        });
    },

    checkEmailVerificationHash: (data) => { // check if the email_verification_hash is belong to the user with the represeting email
        return new Promise((resolve, reject) => { 

            database.query('SELECT count(*) as rows FROM users WHERE email = ? AND verify_email_hash = ?', [data.email, data.token], (error, result) => {
                if (error) reject(error);
                resolve(result[0].rows);
            });
        });
    },

    setAccountAsVerified: (email) => { // set the account with the given email as verified
        return new Promise((resolve, reject) => { 

            database.query('UPDATE users SET is_verified = 1 WHERE email = ?', email, (error, result) => {
                if (error) reject(error);
                resolve('Account has been verified');
            });
        });
    },

    fetchUserWithEmail: (email) => { // return a promise contain the user row
        return new Promise((resolve, reject) => {
            database.query('SELECT * FROM users WHERE email = ?', email, (error, result) => {
                if (error) reject(error);
                resolve(result[0]);
            });
        });
    },

    fetchUserWithUsername: (username) => { // return a promise contain the user row
        return new Promise((resolve, reject) => {
            database.query('SELECT * FROM users WHERE username = ?', username, (error, result) => {
                if (error) reject(error);
                resolve(result[0]);
            });
        });
    },

    setForgetPasswordHash: (data) => { // set the forget password hash in the user row
        return new Promise((resolve, reject) => { 
            database.query('UPDATE users SET forget_pass_hash = ? WHERE email = ?',[data.token, data.email], (error, result) => {
                if (error) reject(error);
                resolve('Account has been verified');
            });
        });
    }
}