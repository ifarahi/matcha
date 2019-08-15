const   express = require('express');
const   mysql   = require('mysql');

const db = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : process.env.DB_PASS,
    database : 'matcha'
  });
   
db.connect();

module.exports = db;