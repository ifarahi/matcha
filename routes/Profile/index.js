const   express = require('express');
const   router = express.Router();
const   userController = require('../../controllers/UsersController');
const   validation = require('../../middleware/validation');
const   auth = require('../../middleware/auth');