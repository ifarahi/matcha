const express = require('express');
const router = express.Router();
const validation = require('../../middleware/validation');
const auth = require('../../middleware/auth');
const browseFilter = require('../../middleware/browseFilter');
const browseController = require('../../controllers/BrowseController');

router.post('/fetchProfiles', auth, validation.fetchProfiles, browseFilter, browseController.fetchProfiles);
router.post('/fetchUserProfile', auth, browseController.fetchUserProfile);

module.exports = router;