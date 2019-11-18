const   express = require('express');
const   router = express.Router();
const   auth = require('../../middleware/auth');
const   privacyController = require('../../controllers/PrivacyController');

router.post('/blockUser', auth, privacyController.blockUser);
router.post('/unblockUser', auth, privacyController.unblockUser);

module.exports = router;