const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const browseController = require('../../controllers/BrowseController');

router.get('/fetchDefaultProfiles', auth, browseController.fetchDefaultProfiles);

module.exports = router;