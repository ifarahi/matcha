const   database   = require('../database/db');


database.query('select * from users where id = 1', (err, res) => {
    console.log(res);
}); 