const   express = require('express');
const   mysql   = require('mysql');

const db = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : 'drecho6567',
    database : 'matcha'
  });
   
db.connect();

module.exports = {

    query: async (sql, values) => {
         db.query(sql, values, (error, result) => {
            return new Promise((res, rej) => {
                res(result);
            });
        });
        return result;
    },
    adduser: (sql, values) => {
        db.query(sql, values, function(error, res) {
            console.log(res);
        });
    },
    ret: () => {
            return new Promise((res, rej) => {
                res('done');
            })
    }
}