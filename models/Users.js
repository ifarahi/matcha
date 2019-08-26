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
            const   { firstname, lastname, username, gender, email, password, verify_email_token } = data; // using objects destructuring to extract only needed informations from the request body 
            const   sql = 'INSERT INTO users (firstname, lastname, username, gender, email, password, verify_email_token) VALUES (?, ?, ?, ?, ?, ?, ?)'; // prepare the statement using positional params '?'
            const   values = [ firstname, lastname, username, gender, email, password, verify_email_token]; // values to be binded the first '?' will be replaced with the first element in the array and so on
            database.query(sql, values, (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        });
    },

    checkEmailVerificationToken: (data) => { // check if the email_verification_Token is belong to the user with the represeting email
        return new Promise((resolve, reject) => { 

            database.query('SELECT count(*) as rows FROM users WHERE email = ? AND verify_email_token = ?', [data.email, data.token], (error, result) => {
                if (error) reject(error);
                resolve(result[0].rows);
            });
        });
    },

    setAccountAsVerified: (email) => { // set the account with the given email as verified
        return new Promise((resolve, reject) => { 

            database.query('UPDATE users SET is_verified = 1 WHERE email = ?', email, (error, result) => {
                if (error) reject(error);
                resolve(true);
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

    setForgetPasswordToken: (data) => { // set the forget password token in the user row
        return new Promise((resolve, reject) => { 
            database.query('UPDATE users SET forget_pass_token = ? WHERE email = ?',[data.token, data.email], (error, result) => {
                if (error) reject(error);
                resolve(true);
            });
        });
    },

    unsetForgetPasswordToken: (id) => { // unset the forget password token in the user row
        return new Promise((resolve, reject) => { 
            database.query('UPDATE users SET forget_pass_token = 0 WHERE id = ?', id, (error, result) => {
                if (error) reject(error);
                resolve(true);
            });
        });
    },

    isValidToken: (token) => { // fetch the user with the account recovery token
        return new Promise((resolve, reject) => { 
            database.query('SELECT count(*) as rows FROM users WHERE forget_pass_token = ?', token, (error, result) => {
                if (error) reject(error);
                resolve(result[0].rows);
            });
        });
    },

    fetchUserWithRecoveryToken: (token) => { // fetch the user with the account recovery token
        return new Promise((resolve, reject) => { 
            database.query('SELECT * FROM users WHERE forget_pass_token = ?', token, (error, result) => {
                if (error) reject(error);
                resolve(result[0]);
            });
        });
    },

    updateUserPassword: (data) => { // update the user password with the given id
        return new Promise((resolve, reject) => { 
            database.query('UPDATE users SET password = ? WHERE id = ?',[data.password, data.id], (error, result) => {
                if (error) reject(error);
                resolve(true);
            });
        });
    },

    completeProfile: (data) => {
        return new Promise((resolve, reject) => { 
            const   { age, bio, sexual_preferences, id } = data; // using objects destructuring to extract only needed informations from the request body 
            const   sql = 'UPDATE users SET age = ?, bio = ?, sexual_preferences = ?, is_first_visit = 0 WHERE id = ?'; // prepare the statement using positional params '?'
            const   values = [ age, bio, sexual_preferences, id]; // values to be binded the first '?' will be replaced with the first element in the array and so on
            database.query(sql, values, (error, result) => {
                if (error) reject(error);
                resolve(true);
            });
        });
    },

    insertUserTag: (data) => { // insert in tags table the user id and the tag
        return new Promise((resolve, reject) => { 
            database.query('INSERT INTO tags (user_id, tag) VALUES (?, ?)',[data.id, data.tag], (error, result) => {
                if (error) reject(error);
                resolve(true);
            });
        });
    }
}