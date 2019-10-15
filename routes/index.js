const   express = require('express');
const   router = express.Router();
const   Users = require('./Users');
const   Profile = require('./Profile');

/*
**** This is the router module wich is responsable to pass controll to the right router 
**** ex : any request start with '/users' will be handled with the users, router '/images' will be handled with images router
*/

router.use('/users', Users); // any reqeust contains '/users' will be handled by the user router 
// router.use('/profile', Profile);

module.exports = router;
