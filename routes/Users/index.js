const   express = require('express');
const   router = express.Router();
const   userController = require('../../controllers/UsersController');

router.post('/register', userController.userRegistration);

module.exports = router;
