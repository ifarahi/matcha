const express = require('express');
const router = express.Router();
const validation = require('../../middleware/validation');
const auth = require('../../middleware/auth');
const browseFilter = require('../../middleware/browseFilter');
const browseController = require('../../controllers/BrowseController');
const {isProfileCompleted} = require('../../middleware/authorization');

router.post('/fetchProfiles', auth,  isProfileCompleted, validation.fetchProfiles, browseFilter, browseController.fetchProfiles);
router.post('/fetchUserProfile', auth, isProfileCompleted, validation.fetchUserProfile, browseController.fetchUserProfile);
router.post('/islike', auth, browseController.isLike);

module.exports = router;