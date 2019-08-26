const   mysql   = require('mysql');

/*
*** The database module connect to the databse and exports the db object
*/

const db = mysql.createConnection({
    host     : '127.0.0.1',
    port     : '3306',
    user     : 'root',
    password : process.env.DB_PASS, // using the password stored in the env variable called 'DB_PASS' : run the cmd export DB_PASS='password'
    database : 'matcha'
  });
   
db.connect();

module.exports = db;