
/*
*** @generate: Generate a random 32 characters 
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
            resolve(result); // return the random generated string
        });
    }
}