const   express = require('express');
const   router = express.Router();
const   userController = require('../../controllers/UsersController');
const   validation = require('../../middleware/validation');
const   auth = require('../../middleware/auth');
const   authorization = require('../../middleware/authorization');
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
router.post('/setProfilePicture', auth, validation.isFileName, ProfileController.setProfilePicture);
router.get('/getUserImages/:id', auth, authorization.isProfileCompleted, ProfileController.getUserImages);
router.post('/deleteUserImage', auth, validation.isFileName, ProfileController.deleteUserImage);
router.post('/completeProfileTags/add', auth, tagCleaner, validation.tags, ProfileController.completeProfile_tags_add);
router.post('/completeProfileTags/delete', auth, tagCleaner, validation.tags, ProfileController.completeProfile_tags_delete);
router.get('/completeProfileTags/get/count', auth, ProfileController.ompleteProfile_tags_getCount);
router.get('/completeProfileTags/get', auth, ProfileController.completeProfile_tags_get);
router.get('/completeProfileTags/get/all', auth, ProfileController.completeProfile_tags_getAll);
router.get('/completeProfileTags/get/finish', auth, ProfileController.ompleteProfile_tags_validate);
router.get('/completeprofile/progress', auth, ProfileController.fetchCompleteProfileProgress);
router.get('/completeUserProfile/finish', auth, ProfileController.completeUserProfile);

module.exports = router;