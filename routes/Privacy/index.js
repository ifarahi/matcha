const   express = require('express');
const   router = express.Router();
const   auth = require('../../middleware/auth');
const   privacyController = require('../../controllers/PrivacyController');
const   validation = require('../../middleware/validation');
const {isProfileCompleted} = require('../../middleware/authorization');

router.post('/blockUser', auth, isProfileCompleted, validation.privacy, privacyController.blockUser);
router.post('/unblockUser', auth, isProfileCompleted, validation.privacy, privacyController.unblockUser);
router.post('/report', auth, isProfileCompleted, validation.privacy, privacyController.report);
router.get('/getBlockedList', auth, isProfileCompleted, privacyController.getBlockedList);
router.post('/getblockeruserinfo', auth, isProfileCompleted, privacyController.getBlockedUserInfo);

module.exports = router;