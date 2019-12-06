const   express = require('express');
const   router = express.Router();
const   auth = require('../../middleware/auth');
const chatController = require('../../controllers/ChatController');
router.post('/get', auth, chatController.loadMessages)

module.exports = router;
