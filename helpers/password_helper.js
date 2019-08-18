const bcrypt = require('bcrypt');

/*
*** This is helper module is used to hash new password and verify hashed password
*/

module.exports = {
    password_hash : (password) => { // take plaintext password and return hashed password
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function(err, hash) {
                resolve(hash);
            });
        });
    },

    password_verify : (password, hashed_password) => { // take plaintext password and hashed password compare them and return either true or false
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hashed_password, function(err, res) {
                resolve(res);
            });
        });
    }
}