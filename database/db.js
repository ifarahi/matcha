const   mysql   = require('mysql');

/*
*** The database module connect to the databse and exports the db object
*/

const db = mysql.createConnection({
    host     : '10.11.1.2',
    port     : '3306',
    user     : 'root',
    password : 'tiger', // using the password stored in the env variable called 'DB_PASS' : run the cmd export DB_PASS='password'
    database : 'Matcha'
  });
   
db.connect();

module.exports = db;