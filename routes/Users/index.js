const   express = require('express');
const   router = express.Router();
const   userController = require('../../controllers/UsersController');
const   validation = require('../../middleware/validation');
const   auth = require('../../middleware/auth');

/*
**** Users router responsable for any request belong to the users controller check the request and pass it to be hanled with the right method 
**** ex : '/register' will be hanled with  userController.register method and '/login' will be hanled with  userController.login method
**** IMPORTANT : every route start with '/setting/...' require the auth is used to update the user infromation from the setting page
****
*/

router.post('/register', validation.register, userController.register); // if the request reached this part thats mean validtion has been successfuly passed

router.post('/login', validation.login, userController.login); // check if the user exist login the user

router.get('/completeRegistration/:email/:token', userController.completeRegistarion); // verifying user email

router.get('/forgetPassword/:email', validation.forgetPassword, userController.forgetPassword); // send a recovery email to user to re-initialize account password

router.get('/isValidToken/:token', userController.isValidToken); // verify if the given token is valid (belong to a user)
router.post('/reinitializePassword', validation.reinitializePassword, userController.reinitializePassword); // set new password to the user with the give token

router.post('/setting/changePassword', auth, validation.changePassword, userController.changePassword); // change user password after login

router.post('/setting/changePersonalInformations', auth, validation.changePersonalInformations, userController.changePersonalInformations);

//this route checks if the jwt is valid
router.post('/authenticate', auth, userController.authenticate);
router.get('/updateAuthToken', auth, userController.updateAuthToken);

module.exports = router;