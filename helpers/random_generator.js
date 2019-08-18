const MD5 = require('MD5.js');
const bcrypt = require('bcrypt');

/*
*** Random string generator export three functions
*** @generate: Generate a random 32 characters and hashed with MD5 (used on low security level token as email verification)
*** @hashToken: Hash the generated MD5 token with bcrypt (to use on high security level as password re-initializing)
*** @verifyToken: Verifying a token with a hashed one 
*/

module.exports = { 
    generate : (length) => {
        return new Promise((resolve, reject) => {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength)); // generate 32 random  character
            }
            resolve(new MD5().update(result).digest('hex')); // hash the 32 character generated
        });
    }, 

    hashToken: (token) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(token, 10, function(err, hash) {
                resolve(hash);
            });
        });
    },

    verifyToken: (token, hashed) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(token, hashed, function(err, res) {
                resolve(res);
            });
        });
    }
}