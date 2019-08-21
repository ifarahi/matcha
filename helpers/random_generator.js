const MD5 = require('MD5.js');
const bcrypt = require('bcrypt');

/*
*** @generate: Generate a random 32 characters and hashed with MD5
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
    }
}