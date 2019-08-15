const   express = require('express');
const   router = express.Router();
const   userController = require('../../controllers/UsersController');
const   validation = require('../../middleware/validation');

router.use('/register', validation.register);

router.post('/register', userController.register);

module.exports = router;
