const   express = require('express');
const   router = express.Router();
const   settingController = require('../../controllers/SettingController');
const   validation = require('../../middleware/validation');
const   auth = require('../../middleware/auth');
const {isProfileCompleted} = require('../../middleware/authorization');

router.post('/changePassword', auth, isProfileCompleted, validation.changePassword, settingController.changePassword); // change user password after login
router.post('/changePersonalInformations', auth, isProfileCompleted, validation.changePersonalInformations, settingController.changePersonalInformations);
router.post('/updateUserLocation', auth, settingController.updateUserLocation);

module.exports = router;