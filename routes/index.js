const   express = require('express');
const   router = express.Router();
const   Users = require('./Users');

router
    .use('/users', Users);

module.exports = router;
