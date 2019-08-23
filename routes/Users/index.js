const   express = require('express');
const   router = express.Router();
const   userController = require('../../controllers/UsersController');
const   validation = require('../../middleware/validation');
const   auth = require('../../middleware/auth');
/*
**** Users router responsable for any request belong to the users controller check the request and pass it to be hanled with the right method 
**** ex : '/register' will be hanled with  userController.register method and '/login' will be hanled with  userController.login method
*/

router.use('/register', validation.register); // if the request is to register a new user the request body should be validate first by the register middlware
router.post('/register', userController.register); // if the request reached this part thats mean validtion has been successfuly passed

router.use('/login', validation.login); // if the request is to login the request body should be validate first by the login middlware
router.post('/login', userController.login); // if the request reached this part thats mean validtion has been successfuly passed

router.get('/completeRegistration/:email/:token', userController.completeRegistarion); // verifying user email

router.get('/forgetPassword/:email', validation.forgetPassword, userController.forgetPassword); // send a recovery email to user to re-initialize account password

router.get('/isValidToken/:token', userController.isValidToken); // verify if the given token is valid (belong to a user)
router.post('/reinitializePassword', validation.reinitializePassword, userController.reinitializePassword); // set new password to the user with the give token



module.exports = router;
