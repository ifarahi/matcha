const MD5 = require('MD5.js');

/*
*** Random string generator exports a funciton take in params string lenght and return a md5 hash of the string;
*/

module.exports = (length) => {
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