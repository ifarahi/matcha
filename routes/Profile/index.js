const   express = require('express');
const   router = express.Router();
const   userController = require('../../controllers/UsersController');
const   validation = require('../../middleware/validation');
const   auth = require('../../middleware/auth');
const   cleanTag = require('../../middleware/tag_cleaner');
const   ProfileController = require('../../controllers/ProfileController');
const   uploadEngine = require('../../middleware/uploadImages');
const   tagCleaner = require('../../middleware/tag_cleaner');


router.post('/completeProfile_info', auth, validation.completeProfile_info, ProfileController.completeProfile_info);
router.post('/completeProfile_images', auth, 
    ProfileController.isReachedMaxPictures, 
    uploadEngine.upload.single('image'),
    uploadEngine.validate,
    ProfileController.completeProfile_images);
router.post('/setProfilePicture', auth, ProfileController.setProfilePicture);
router.get('/getUserImages/:id', auth, ProfileController.getUserImages);
router.post('/deleteUserImage', auth, ProfileController.deleteUserImage);
router.post('/completeProfileTags/add', tagCleaner, validation.tags, ProfileController.completeProfile_tags_add);
router.post('/completeProfileTags/delete', tagCleaner, validation.tags, ProfileController.completeProfile_tags_delete);
router.get('/completeProfileTags/get', ProfileController.completeProfile_tags_get);

module.exports = router;