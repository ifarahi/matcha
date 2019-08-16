const   express = require('express');
const   router = express.Router();
const   userController = require('../../controllers/UsersController');
const   validation = require('../../middleware/validation');

/*
**** Users router responsable for any request belong to the users controller check the request and pass it to be hanled with the right method 
**** ex : '/register' will be hanled with  userController.register method and '/login' will be hanled with  userController.login method
*/

router.use('/register', validation.register); // if the request is to register a new user the request body should be validate first by the register middlware

router.post('/register', userController.register); // if the request reached this part thats mean validtion has been successfuly passed

module.exports = router;
