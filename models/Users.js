const   express = require('express');
const   router  = express.Router();
const   database   = require('../database/db');

// console.log(database.adduser('insert into users (name) values (?)', ['farahi']));

database.query('select * from users where id = ?', [1])
    .then(res => console.log(res) );

