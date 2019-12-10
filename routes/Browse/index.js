const express = require('express');
const router = express.Router();
const validation = require('../../middleware/validation');
const auth = require('../../middleware/auth');
const browseFilter = require('../../middleware/browseFilter');
const browseController = require('../../controllers/BrowseController');
const {isProfileCompleted} = require('../../middleware/authorization');

router.post('/fetchProfiles', auth,  isProfileCompleted, validation.fetchProfiles, browseFilter, browseController.fetchProfiles);
router.post('/fetchUserProfile', auth, isProfileCompleted, validation.fetchUserProfile, browseController.fetchUserProfile);
router.post('/islike', auth, isProfileCompleted, validation.validUserId, browseController.isLike);
router.post('/isMatch', auth, isProfileCompleted, validation.validUserId, browseController.isMatch);
router.get('/getUserMatches', auth, isProfileCompleted, browseController.fetchUserMatches);
router.get('/getUserLikes', auth, isProfileCompleted, browseController.getUserlikes);
router.get('/getUserLiked', auth, isProfileCompleted, browseController.getUserliked);
router.get('/fetchTags', auth, isProfileCompleted, browseController.fetchTags);
router.get('/fetchVisitsHistory', auth, isProfileCompleted, browseController.getVisitsHistory);
router.post('/getLastConnection', auth, browseController.getLastConnection);

module.exports = router;