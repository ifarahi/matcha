const   express = require('express');
const   router = express.Router();
const   settingController = require('../../controllers/SettingController');
const   validation = require('../../middleware/validation');
const   auth = require('../../middleware/auth');

router.post('/changePassword', auth, validation.changePassword, settingController.changePassword); // change user password after login
router.post('/changePersonalInformations', auth, validation.changePersonalInformations, settingController.changePersonalInformations);
router.post('/updateUserLocation', auth, settingController.updateUserLocation);

module.exports = router;