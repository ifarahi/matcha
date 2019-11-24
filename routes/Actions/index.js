const express = require('express');
const router = express.Router();
const validation = require('../../middleware/validation');
const actionsController = require('../../controllers/ActionsContoller');
const auth = require('../../middleware/auth');

router.post('/likeUser', auth, actionsController.likeUser);
router.post('/unlikeUser', auth, actionsController.unLikeUser);

module.exports = router;