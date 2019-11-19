const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const browseFilter = require('../../middleware/browseFilter');
const browseController = require('../../controllers/BrowseController');

router.post('/fetchProfiles', auth, browseFilter,browseController.fetchProfiles);

module.exports = router;